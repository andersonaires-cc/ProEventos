using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersit;
        private readonly IEventoPersist _eventoPersist;
        public EventoService(IGeralPersist geralPersit, IEventoPersist eventoPersist)
        {
            _eventoPersist = eventoPersist;
            _geralPersit = geralPersit;
            
        }
        public async Task<EventoDto> AddEventos(EventoDto model)
        {
            try
            {
                _geralPersit.Add<Evento>(model);
                if(await _geralPersit.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null)return null;

                model.Id = evento.Id;

                _geralPersit.Update(model);
                if(await _geralPersit.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) throw new Exception("Evento para delete não encontrado.");

                _geralPersit.Delete<Evento>(evento);
                return(await _geralPersit.SaveChangesAsync());
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if(eventos ==null)return null;
                var eventosRetorno = new List<EventoDto>();

                foreach (var evento in eventos)
                {
                    eventosRetorno.Add(new EventoDto(){
                        Id = evento.Id,
                        Local = evento.Local,
                        DataEvento = evento.DataEvento.ToString(),
                        Tema = evento.Tema,
                        QtdPessoas = evento.QtdPessoas,
                        ImagemURL = evento.ImagemURL,
                        Telefone = evento.Telefone,
                        Email = evento.Email
                    });
                }

                return eventos;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if(eventos ==null)return null;

                return eventos;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if(eventos ==null)return null;

                return eventos;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

    }
}