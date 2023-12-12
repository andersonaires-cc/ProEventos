using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application.Contratos
{
    public interface IPalestranteService
    {
        Task<PalestranteDto> AddPalestrantes(int userId, PalestranteAddDto model);
        Task<PalestranteDto> UpdatePalestrante(int userId, PalestranteUpdateDto model);
        Task<PageList<EventoDto>> GetAllPalestrantesAsync(int userId, PageParams pageParams, bool includeEventos= false);        
        Task<EventoDto> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);         
    }
}