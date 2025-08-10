import { useState } from "react";
import { useContent } from "@/context/ContentContext";
import { type Album } from "@/context/ContentContext";
import AlbumViewer from "@/components/AlbumViewer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Image as ImageIcon } from "lucide-react";

const Gallery = () => {
  const { content } = useContent();
  const { title, description, albums } = content.gallery;
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <>
      <section id="gallery" className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
              {description}
            </p>
          </div>

          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="animate-fade-in cursor-pointer group"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => setSelectedAlbum(album)}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <CardHeader className="relative h-48 p-0">
                      {album.photos.length > 0 ? (
                        <img
                          src={album.photos[0].url}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle>{album.title}</CardTitle>
                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {album.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              No albums have been created yet.
            </div>
          )}
        </div>
      </section>

      <AlbumViewer
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </>
  );
};

export default Gallery;