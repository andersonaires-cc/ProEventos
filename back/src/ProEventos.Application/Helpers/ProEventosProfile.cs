using System;
using System.Collections.Generic;
using AutoMapper;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Helpers
{
    public class ProEventosProfile: Profile
    {
        public ProEventosProfile()
        {
            CreateMap<Evento,EventoDto>();
        }
    }
}