import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, X } from "lucide-react";

// Import all machinery images
import tractorStock from "@/assets/tractor-stock.jpg";
import harvesterStock from "@/assets/harvester-stock.jpg";
import machinesCollection from "@/assets/machines-collection.jpg";
import harvestmasterH12 from "@/assets/harvestmaster-h12-4wd-1649325881.jpg";
import standardTractorHarvester from "@/assets/standard-tractor-mounted-combine-harvester.jpg";
import loadersDesktop from "@/assets/Loaders_desktop 1.png";
import mahindraRoundBaler from "@/assets/Mahindra Round baler 1.png";
import mahindraStrawBaler from "@/assets/mahindra-round-straw-baler.jpg";
import productJpeg from "@/assets/product-jpeg-500x500.webp";
import mahindraStrawReaper from "@/assets/Mahindra Straw Reaper 2.png";
import mahindraBasketThresher from "@/assets/Mahindra Basket Thresher P-990 1.png";
import mahindraPaddyThresher from "@/assets/Mahindra Paddy - Multi Thresher P-80 1.png";
import istockTractor from "@/assets/istockphoto-1096903098-612x612.jpg";
import mildSteelPlough from "@/assets/mild-steel-blue-painted-highly-durable-5-teeth-tractor-driven-plough-cultivator-for-agriculture-248.jpg";
import rigidCultivator from "@/assets/9-tynes-rigid-type-agriculture-tractor-cultivator-2216967740-dznbdtyp.avif";
import discHarrow from "@/assets/agricultural-machinery-agriculture-disc-harrow-cultivator-png-favpng-vqU6Yp8dKD5RFEYF3gMPtQ628.jpg";
import ag400PaddyThresher from "@/assets/AG400_Paddy_tresher.webp";
import tractorRotavator from "@/assets/tractor-rotavator-power-18-hp-2216880342-7ln43l72.avif";
import additionalImage from "@/assets/A3f142b0374814f3e95c4ad4d5ecbf91eY.avif";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: tractorStock,
    alt: 'John Deere Tractor',
    category: 'Tractor',
    title: 'John Deere 6120M Tractor',
    description: 'High-performance tractor with advanced GPS guidance system and climate control.'
  },
  {
    id: '2',
    src: harvesterStock,
    alt: 'Case IH Harvester',
    category: 'Harvester',
    title: 'Case IH Axial-Flow 250 Harvester',
    description: 'Advanced combine harvester with grain loss monitoring and yield mapping.'
  },
  {
    id: '3',
    src: harvestmasterH12,
    alt: 'Harvestmaster H12',
    category: 'Harvester',
    title: 'Harvestmaster H12 4WD',
    description: 'Compact harvester perfect for small to medium farms with 4WD capability.'
  },
  {
    id: '4',
    src: standardTractorHarvester,
    alt: 'Tractor-Mounted Combine',
    category: 'Harvester',
    title: 'Standard Tractor-Mounted Combine',
    description: 'Versatile tractor-mounted harvester for multiple crops with adjustable header.'
  },
  {
    id: '5',
    src: loadersDesktop,
    alt: 'Front-End Loader',
    category: 'Loader',
    title: 'Front-End Loader',
    description: 'Heavy-duty front-end loader for material handling with quick attach system.'
  },
  {
    id: '6',
    src: mahindraRoundBaler,
    alt: 'Mahindra Round Baler',
    category: 'Baler',
    title: 'Mahindra Round Baler',
    description: 'Efficient round baler for hay and straw baling with auto tie mechanism.'
  },
  {
    id: '7',
    src: mahindraStrawBaler,
    alt: 'Mahindra Straw Baler',
    category: 'Baler',
    title: 'Mahindra Straw Baler',
    description: 'Specialized baler for straw and crop residue with high capacity output.'
  },
  {
    id: '8',
    src: productJpeg,
    alt: 'Premium Tractor',
    category: 'Tractor',
    title: 'Premium Tractor Unit',
    description: 'Top-of-the-line tractor with luxury features and advanced technology.'
  },
  {
    id: '9',
    src: mahindraStrawReaper,
    alt: 'Mahindra Straw Reaper',
    category: 'Reaper',
    title: 'Mahindra Straw Reaper',
    description: 'Efficient straw reaper for crop residue management with adjustable height.'
  },
  {
    id: '10',
    src: mahindraBasketThresher,
    alt: 'Mahindra Basket Thresher',
    category: 'Thresher',
    title: 'Mahindra Basket Thresher P-990',
    description: 'Traditional basket thresher for grain processing with manual operation.'
  },
  {
    id: '11',
    src: mahindraPaddyThresher,
    alt: 'Mahindra Paddy Thresher',
    category: 'Thresher',
    title: 'Mahindra Paddy Multi-Thresher P-80',
    description: 'Specialized thresher for paddy and rice crops with multi-crop capability.'
  },
  {
    id: '12',
    src: istockTractor,
    alt: 'Premium Farm Tractor',
    category: 'Tractor',
    title: 'Premium Farm Tractor',
    description: 'Professional grade tractor for commercial farming with high horsepower.'
  },
  {
    id: '13',
    src: mildSteelPlough,
    alt: 'Mild Steel Plough',
    category: 'Cultivator',
    title: 'Mild Steel Plough Cultivator',
    description: 'Durable 5-teeth plough for soil preparation with mild steel construction.'
  },
  {
    id: '14',
    src: rigidCultivator,
    alt: 'Rigid Type Cultivator',
    category: 'Cultivator',
    title: 'Rigid Type Cultivator',
    description: '9-tynes rigid cultivator for intensive farming with high durability.'
  },
  {
    id: '15',
    src: discHarrow,
    alt: 'Disc Harrow',
    category: 'Cultivator',
    title: 'Disc Harrow Cultivator',
    description: 'Disc harrow for soil breaking and leveling with disc design.'
  },
  {
    id: '16',
    src: ag400PaddyThresher,
    alt: 'AG400 Paddy Thresher',
    category: 'Thresher',
    title: 'AG400 Paddy Thresher',
    description: 'AG400 series paddy thresher with enhanced efficiency for rice processing.'
  },
  {
    id: '17',
    src: tractorRotavator,
    alt: 'Tractor Rotavator',
    category: 'Rotavator',
    title: 'Tractor Rotavator 18 HP',
    description: '18 HP tractor rotavator for soil cultivation with tractor mounted design.'
  },
  {
    id: '18',
    src: additionalImage,
    alt: 'Additional Agricultural Equipment',
    category: 'Specialty',
    title: 'Additional Agricultural Equipment',
    description: 'Specialized agricultural equipment for unique farming needs and applications.'
  }
];

export const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Equipment Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of agricultural machinery. 
            Click on any image to view it in full detail.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <Badge className="mb-2 bg-primary/80">{image.category}</Badge>
                      <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/80 line-clamp-2">{image.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <ZoomIn className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{image.category}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold">{image.title}</h3>
                    <p className="text-muted-foreground">{image.description}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Equipment Categories Summary */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Equipment Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => {
              const count = galleryImages.filter(img => img.category === category).length;
              return (
                <div
                  key={category}
                  className="text-center p-4 bg-gradient-to-br from-primary/10 to-agriculture-gold/10 rounded-lg hover:from-primary/20 hover:to-agriculture-gold/20 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground">{category}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-agriculture-gold/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Rent?</h3>
            <p className="text-muted-foreground mb-6">
              Browse our equipment catalog and find the perfect machinery for your farming needs.
            </p>
            <Button variant="agriculture" size="lg">
              View Equipment Catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}; 