using PublicationActivity.Data.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace PublicationActivity.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<User>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<Publication> Publications { get; set; }
        public DbSet<PublicationType> PublicationTypes { get; set; }
        public DbSet<PrimaryReferenceLocation> PrimaryReferenceLocations { get; set; }
        public DbSet<SecondaryReferenceLocation> SecondaryReferenceLocations { get; set; }
        public DbSet<Contributor> Contributors { get; set; }
        public DbSet<ContributorPublication> ContributorPublications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Contributor>()
                .HasIndex(p => new { p.FirstName, p.LastName })
                .IsUnique(false);

            builder.Entity<Publication>(p =>
            {
                p.Property<string>("Identifier")
                    .UseCollation("NOCASE");

                p.Property<string>("IsiImpactFactor")
                    .UseCollation("NOCASE");

                p.Property<string>("OriginalTitle")
                    .UseCollation("NOCASE");

                p.Property<string>("PublicationLanguageCode")
                    .UseCollation("NOCASE");

                p.Property<string>("PublicationLink")
                    .UseCollation("NOCASE");

                p.Property<string>("PublisherData")
                    .UseCollation("NOCASE");

                p.Property<string>("SjrScopusImpactRank")
                    .UseCollation("NOCASE");

                p.Property<string>("TertiaryReferenceLocation")
                    .UseCollation("NOCASE");
            });

            builder.Entity<Contributor>(p =>
            {
                p.Property<string>("FirstName")
                    .UseCollation("NOCASE");

                p.Property<string>("LastName")
                    .UseCollation("NOCASE");
            });

            builder.Entity<ContributorPublication>(c =>
            {
                c.HasKey(x => new { x.ContributorId, x.PublicationId });

                c.Property<int>("Order");

                c.HasOne(bc => bc.Publication)
                    .WithMany(b => b.ContributorPublications)
                    .HasForeignKey(bc => bc.PublicationId);

                c.HasOne(bc => bc.Contributor)
                    .WithMany(c => c.ContributorPublications)
                    .HasForeignKey(bc => bc.ContributorId);
            });

            builder.Entity<PublicationType>().HasData(
                new PublicationType() { Id = 1, Name = "Доклад от конференция", Supported = true },
                new PublicationType() { Id = 2, Name = "Статия в списания и поредици", Supported = true },
                new PublicationType() { Id = 3, Name = "Книга", Supported = true },
                new PublicationType() { Id = 4, Name = "Учебник" },
                new PublicationType() { Id = 5, Name = "Учебно пособие" },
                new PublicationType() { Id = 6, Name = "Монография", Supported = true },
                new PublicationType() { Id = 7, Name = "Глава от колективна монография" },
                new PublicationType() { Id = 8, Name = "Студия" },
                new PublicationType() { Id = 9, Name = "Речник" },
                new PublicationType() { Id = 10, Name = "Патент" }
            );

            builder.Entity<PrimaryReferenceLocation>().HasData(
               new PrimaryReferenceLocation() { Id = 1, Name = "Web of Science" },
               new PrimaryReferenceLocation() { Id = 2, Name = "Scopus" },
               new PrimaryReferenceLocation() { Id = 3, Name = "Web of Science и Scopus" }
            );

            builder.Entity<SecondaryReferenceLocation>().HasData(
               new SecondaryReferenceLocation() { Id = 1, Name = "Zentralblatt" },
               new SecondaryReferenceLocation() { Id = 2, Name = "MathSciNet" },
               new SecondaryReferenceLocation() { Id = 3, Name = "ACM Digital Library" },
               new SecondaryReferenceLocation() { Id = 4, Name = "IEEE Xplore" },
               new SecondaryReferenceLocation() { Id = 5, Name = "AIS eLibrary" }
            );
        }
    }
}
