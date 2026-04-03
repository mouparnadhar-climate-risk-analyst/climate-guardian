import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-8 md:pb-12">
      <div className="container text-center">
        <p className="text-xs md:text-sm font-orbitron tracking-[0.35em] text-primary/90 uppercase mb-3">
          TerraQuant
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
        >
          Climate Risk Intelligence for{" "}
          <span className="text-primary text-glow">Global Assets</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Institutional-grade analysis powered by real-time IPCC &amp; satellite data.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
