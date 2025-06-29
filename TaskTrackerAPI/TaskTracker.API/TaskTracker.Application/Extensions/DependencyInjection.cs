using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Extensions.AutoMapper;


namespace TaskTracker.Application.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly)
        );
        return services;
    }
}
