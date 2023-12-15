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
        public async Task<IActionResult> SaveByEvento(RedeSocialDto[] models)
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
        

        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<IActionResult> Delete(int eventoId, int loteId)
        {
            try
            {
                
                var lote  = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) return NoContent();

                return await _loteService.DeleteLote(lote.EventoId, lote.Id) 
                        ? Ok(new {message = "Lote Deletado"}) 
                        : throw new Exception("Ocorreu um problema não específico ao tentar deletar Lote.");
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                        $"Erro ao tentar deletar lote. Erro: {ex.Message}");
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
