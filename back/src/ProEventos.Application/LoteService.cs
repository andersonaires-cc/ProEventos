using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly IGeralPersist _geralPersit;
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;
        public LoteService(ILotePersist geralPersit,
                            ILotePersist lotePersist,
                            IMapper mapper)
        {
            _lotePersist = lotePersist;
            _geralPersit = geralPersit;
            _mapper = mapper;
            
        }
        public async Task<LoteDto> AddEventos(LoteDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _geralPersit.Add<Evento>(evento);
                if(await _geralPersit.SaveChangesAsync())
                {
                    var eventoRetorno = await _lotePersist.GetEventoByIdAsync(evento.Id, false);

                    return _mapper.Map<LoteDto>(eventoRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null)return null;

                foreach(var model in models)
                {
                    if(model.Id == 0)
                    {
                        
                    }
                    else
                    {
                        var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);

                        model.EventoId = eventoId;

                        _mapper.Map(model,lote);

                        _geralPersit.Update<Lote>(lote);

                        await _geralPersit.SaveChangesAsync();
                    }
                }

                var loteRetorno = await _lotePersist..GetLotesByEventoIdAsync(eventoId);

                return _mapper.Map<LoteDto[]>(loteRetorno);

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId)
                if(lote == null) throw new Exception("Lote para delete não encontrado.");

                _geralPersit.Delete<Lote>(lote);
                return(await _geralPersit.SaveChangesAsync());
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoIds);
                if(lotes ==null)return null;

                var resultado = _mapper.Map<LoteDto[]>(lotes);     

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto> GetloteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId,loteId);
                if(lote ==null)return null;

                var resultado = _mapper.Map<LoteDto>(lote);     

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

    }
}