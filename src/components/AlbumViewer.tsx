import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Album } from "@/context/ContentContext";
import { Card, CardContent } from "./ui/card";

interface AlbumViewerProps {
  album: Album | null;
  onClose: () => void;
}

const AlbumViewer = ({ album, onClose }: AlbumViewerProps) => {
  if (!album) {
    return null;
  }

  return (
    <Dialog open={!!album} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{album.title}</DialogTitle>
          <DialogDescription>{album.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center">
          {album.photos.length > 0 ? (
            <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-xl">
              <CarouselContent>
                {album.photos.map((photo) => (
                  <CarouselItem key={photo.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 relative">
                          <img
                            src={photo.url}
                            alt={photo.caption || 'Album photo'}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center text-muted-foreground">
              This album doesn't have any photos yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlbumViewer;