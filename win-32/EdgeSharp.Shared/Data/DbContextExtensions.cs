﻿using EdgeSharp.Shared.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace EdgeSharp.Shared.Data
{
    public static class DbContextExtensions
    {
        public static void InitializeDb(this IServiceProvider serviceProvider)
        {
            using (IServiceScope scope = serviceProvider.CreateScope())
            {
                using (var context = scope.ServiceProvider.GetRequiredService<MovieContext>())
                {
                    // Look for any movies.
                    if (context.Movie.Any())
                    {
                        return;   // DB has been seeded
                    }

                    context.Movie.AddRange(
                        new Movie
                        {
                            Title = "When Harry Met Sally",
                            ReleaseDate = DateTime.Parse("1989-2-12"),
                            Genre = "Romantic Comedy",
                            Rating = "R",
                            Price = 7.99M
                        },

                        new Movie
                        {
                            Title = "Ghostbusters ",
                            ReleaseDate = DateTime.Parse("1984-3-13"),
                            Genre = "Comedy",
                            Rating = "PG",
                            Price = 8.99M
                        },

                        new Movie
                        {
                            Title = "Ghostbusters 2",
                            ReleaseDate = DateTime.Parse("1986-2-23"),
                            Genre = "Comedy",
                            Rating = "PG",
                            Price = 9.99M
                        },

                        new Movie
                        {
                            Title = "Rio Bravo",
                            ReleaseDate = DateTime.Parse("1959-4-15"),
                            Genre = "Western",
                            Rating = "PG",
                            Price = 3.99M
                        }
                    );
                    context.SaveChanges();
                }
            }
        }
    }
}
