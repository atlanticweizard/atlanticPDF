import { FileText, BookOpen, Download, Play } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-8 text-center">
            About Atlantic Weizard
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Atlantic Weizard is your destination for premium digital products. We curate the finest PDFs, guides, and online courses to help you achieve your goals and accelerate your growth.
            </p>

            <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-6">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">PDF Downloads</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Instant access to premium guides, templates, checklists, and resources. Download immediately after purchase and keep forever.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Online Courses</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Comprehensive video courses with multiple modules. Learn at your own pace with lifetime access to all content.
                </p>
              </div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-6">
              Our Philosophy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe in quality over quantity. Each product in our collection is carefully selected and curated to provide real value. We don't just sell digital files—we provide transformative knowledge and tools that help you succeed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our name, Atlantic Weizard, represents the confluence of depth and wisdom. Like the vast ocean, we aim to provide deep, meaningful content that makes a lasting impact.
            </p>

            <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-6">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-4 not-prose">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Instant Access</h4>
                <p className="text-sm text-muted-foreground">Get your products immediately after payment</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Lifetime Access</h4>
                <p className="text-sm text-muted-foreground">Access your purchases anytime, forever</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Expert Content</h4>
                <p className="text-sm text-muted-foreground">Created by industry professionals</p>
              </div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-6">
              Our Commitment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We're committed to providing exceptional products and an exceptional experience. From secure payments to instant delivery, every aspect of our platform is designed to serve you better.
            </p>

            <div className="bg-card p-8 rounded-md mt-12 border border-border">
              <p className="text-lg text-card-foreground font-medium italic text-center">
                "Knowledge is the best investment you can make."
              </p>
              <p className="text-center text-muted-foreground mt-2">— Atlantic Weizard</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
