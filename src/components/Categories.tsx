import { ArrowRight } from "lucide-react";

const categories = [
  { 
    name: "Footwear", 
    count: 48,
    gradient: "from-orange-500/20 to-red-500/20"
  },
  { 
    name: "Accessories", 
    count: 36,
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  { 
    name: "Tech", 
    count: 24,
    gradient: "from-green-500/20 to-teal-500/20"
  },
  { 
    name: "Watches", 
    count: 18,
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
];

const Categories = () => {
  return (
    <section id="collections" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Explore our curated collections designed for every occasion
            </p>
          </div>
          <a href="#" className="nav-link flex items-center gap-2 mt-4 md:mt-0">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <a
              key={cat.name}
              href="#"
              className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${cat.gradient} border border-border hover:border-primary/50 transition-all duration-300 group opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {cat.count} items
              </p>
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
