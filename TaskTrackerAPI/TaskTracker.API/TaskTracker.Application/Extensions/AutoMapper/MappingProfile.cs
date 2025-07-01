using System;
using AutoMapper;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Application.DTOs.Auth;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Application.Extensions.AutoMapper;

public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<User, UserResponseDto>();
            CreateMap<CreateUserRequestDto, User>();
            CreateMap<UpdateUserRequestDto, User>();

            // Team
            CreateMap<Team, TeamResponseDto>()
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members));
            CreateMap<CreateTeamRequestDto, Team>();
            CreateMap<UpdateTeamRequestDto, Team>();

            // Todo
            CreateMap<Todo, TodoResponseDto>();
            CreateMap<CreateTodoRequestDto, Todo>();
            CreateMap<UpdateTodoRequestDto, Todo>();
        }
    }
