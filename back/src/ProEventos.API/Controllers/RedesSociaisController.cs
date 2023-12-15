using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using ProEventos.API.Extensions;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RedesSociaisController : ControllerBase
    {
       
        public readonly IRedeSocialService _redeSocialService;
        private readonly IPalestranteService _palestranteService;
        private readonly IEventoService _eventoService;
        
        public RedesSociaisController(  IRedeSocialService redeSocialService,
                                        IEventoService eventoService,
                                        IPalestranteService palestranteService)
        {
            _eventoService = eventoService;
            _palestranteService = palestranteService;
            _redeSocialService = redeSocialService;
        }

        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId)
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized();
                
                var redeSocial = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                if(redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar recuperar lotes. Erro: {ex.Message}");
            }
        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized();
                
                var redeSocial = await _redeSocialService.GetAllByEventoIdAsync(palestrante.Id);
                if(redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar recuperar lotes. Erro: {ex.Message}");
            }
        }        

        [HttpPut("evento/{eventoId}")]
        public async Task<IActionResult> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized();

                var redeSocial = await _redeSocialService.SaveByEvento(eventoId, models);
                if(redeSocial == null)return BadRequest("Erro ao tentar adicionar lote.");
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar salvar rede social. Erro: {ex.Message}");
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveByPalestrante(RedeSocialDto[] models)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized();

                var redeSocial = await _redeSocialService.SaveByPalestrante(palestrante.Id, models);
                if(redeSocial == null)return BadRequest("Erro ao tentar adicionar lote.");
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar salvar rede social. Erro: {ex.Message}");
            }
        }
        
        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {   
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized();

                var RedeSocial  = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(RedeSocial == null) return NoContent();

                return await _redeSocialService.DeleteByEvento(eventoId, redeSocialId) 
                        ? Ok(new {message = "Rede Social Deletada"}) 
                        : throw new Exception("Ocorreu um problema não específico ao tentar deletar Rede Social por evento.");
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar deletar Rede Social por evento+. Erro: {ex.Message}");
            }
        }

        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId)
        {
            try
            {   
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized();

                var RedeSocial  = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrante.Id, redeSocialId);
                if(RedeSocial == null) return NoContent();

                return await _redeSocialService.DeleteByPalestrante(palestrante.Id, redeSocialId) 
                        ? Ok(new {message = "Rede Social Deletada"}) 
                        : throw new Exception("Ocorreu um problema não específico ao tentar deletar Rede Social por palestrante.");
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar deletar Rede Social por evento+. Erro: {ex.Message}");
            }
        }        

        [NonAction]
        private async Task<bool> AutorEvento(int eventoId)
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, false);
            if(evento == null) return false;
            return true;
        }
    }
}
