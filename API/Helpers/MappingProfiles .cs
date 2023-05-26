using API.DTOS;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles ()
        {
            CreateMap<CreateProductDTO, Product>();
        }
    }
}