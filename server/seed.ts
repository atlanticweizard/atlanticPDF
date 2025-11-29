import { db } from "./db";
import { products, courses, courseModules, admins } from "@shared/schema";
import { sql } from "drizzle-orm";

const seedProducts = [
  // PDF Products
  {
    name: "Business Growth Mastery Guide",
    description: "A comprehensive 150-page guide covering proven strategies for scaling your business. Learn customer acquisition, revenue optimization, team building, and sustainable growth tactics used by successful entrepreneurs worldwide.",
    price: "49.00",
    category: "Business",
    image: "/assets/products/business_growth_pdf_guide.png",
    type: "pdf" as const,
    fileUrl: "https://example.com/downloads/business-growth-guide.pdf",
  },
  {
    name: "Digital Marketing Blueprint",
    description: "Master the art of digital marketing with this in-depth guide. Covers SEO, social media marketing, email campaigns, content strategy, and paid advertising. Includes templates, checklists, and real-world case studies.",
    price: "39.00",
    category: "Marketing",
    image: "/assets/products/digital_marketing_pdf_guide.png",
    type: "pdf" as const,
    fileUrl: "https://example.com/downloads/digital-marketing-blueprint.pdf",
  },
  {
    name: "Productivity Power System",
    description: "Transform your daily routine with scientifically-backed productivity techniques. This guide teaches time management, goal setting, habit formation, and focus strategies. Includes printable planners and tracking sheets.",
    price: "29.00",
    category: "Productivity",
    image: "/assets/products/productivity_pdf_guide.png",
    type: "pdf" as const,
    fileUrl: "https://example.com/downloads/productivity-power-system.pdf",
  },
  {
    name: "Financial Freedom Roadmap",
    description: "Your complete guide to building wealth and achieving financial independence. Covers budgeting, investing, passive income streams, tax optimization, and retirement planning. Written by certified financial experts.",
    price: "59.00",
    category: "Finance",
    image: "/assets/products/financial_planning_pdf_guide.png",
    type: "pdf" as const,
    fileUrl: "https://example.com/downloads/financial-freedom-roadmap.pdf",
  },
  // Course Products
  {
    name: "Complete Web Development Bootcamp",
    description: "Learn to build modern websites and web applications from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and database fundamentals. Includes 50+ hours of video content, coding exercises, and real-world projects.",
    price: "199.00",
    category: "Technology",
    image: "/assets/products/web_development_course.png",
    type: "course" as const,
    fileUrl: null,
  },
  {
    name: "Python Programming Masterclass",
    description: "From beginner to advanced Python developer. Learn programming fundamentals, data structures, algorithms, web scraping, automation, data analysis, and machine learning basics. Perfect for career changers and aspiring developers.",
    price: "149.00",
    category: "Technology",
    image: "/assets/products/python_programming_course.png",
    type: "course" as const,
    fileUrl: null,
  },
  {
    name: "Leadership & Management Excellence",
    description: "Develop the skills to lead teams effectively and drive organizational success. Covers communication, delegation, conflict resolution, strategic thinking, and emotional intelligence. Ideal for new managers and aspiring leaders.",
    price: "129.00",
    category: "Business",
    image: "/assets/products/leadership_skills_course.png",
    type: "course" as const,
    fileUrl: null,
  },
];

const courseModulesData = [
  // Web Development Course Modules
  {
    title: "Introduction to Web Development",
    description: "Understanding the web, browsers, and how websites work",
    type: "video" as const,
    contentUrl: "https://example.com/videos/web-intro.mp4",
    orderIndex: 1,
  },
  {
    title: "HTML Fundamentals",
    description: "Learn the structure and semantics of HTML5",
    type: "video" as const,
    contentUrl: "https://example.com/videos/html-basics.mp4",
    orderIndex: 2,
  },
  {
    title: "CSS Styling & Layout",
    description: "Master CSS for beautiful, responsive designs",
    type: "video" as const,
    contentUrl: "https://example.com/videos/css-styling.mp4",
    orderIndex: 3,
  },
  {
    title: "JavaScript Essentials",
    description: "Core JavaScript concepts and DOM manipulation",
    type: "video" as const,
    contentUrl: "https://example.com/videos/js-essentials.mp4",
    orderIndex: 4,
  },
  {
    title: "React Development",
    description: "Building modern UIs with React",
    type: "video" as const,
    contentUrl: "https://example.com/videos/react-dev.mp4",
    orderIndex: 5,
  },
  {
    title: "Course Resources & Cheat Sheets",
    description: "Downloadable reference materials for the course",
    type: "pdf" as const,
    contentUrl: "https://example.com/pdfs/web-dev-resources.pdf",
    orderIndex: 6,
  },
];

const pythonModulesData = [
  {
    title: "Getting Started with Python",
    description: "Installing Python and setting up your development environment",
    type: "video" as const,
    contentUrl: "https://example.com/videos/python-setup.mp4",
    orderIndex: 1,
  },
  {
    title: "Python Basics & Syntax",
    description: "Variables, data types, and basic operations",
    type: "video" as const,
    contentUrl: "https://example.com/videos/python-basics.mp4",
    orderIndex: 2,
  },
  {
    title: "Control Flow & Functions",
    description: "Conditionals, loops, and creating reusable functions",
    type: "video" as const,
    contentUrl: "https://example.com/videos/python-control-flow.mp4",
    orderIndex: 3,
  },
  {
    title: "Data Structures in Python",
    description: "Lists, dictionaries, tuples, and sets",
    type: "video" as const,
    contentUrl: "https://example.com/videos/python-data-structures.mp4",
    orderIndex: 4,
  },
  {
    title: "Object-Oriented Programming",
    description: "Classes, objects, inheritance, and polymorphism",
    type: "video" as const,
    contentUrl: "https://example.com/videos/python-oop.mp4",
    orderIndex: 5,
  },
  {
    title: "Python Quick Reference Guide",
    description: "Comprehensive Python syntax and library reference",
    type: "pdf" as const,
    contentUrl: "https://example.com/pdfs/python-reference.pdf",
    orderIndex: 6,
  },
];

const leadershipModulesData = [
  {
    title: "Foundations of Leadership",
    description: "Understanding leadership styles and finding your voice",
    type: "video" as const,
    contentUrl: "https://example.com/videos/leadership-foundations.mp4",
    orderIndex: 1,
  },
  {
    title: "Effective Communication",
    description: "Master the art of clear, persuasive communication",
    type: "video" as const,
    contentUrl: "https://example.com/videos/leadership-communication.mp4",
    orderIndex: 2,
  },
  {
    title: "Team Building & Motivation",
    description: "Creating high-performing teams that deliver results",
    type: "video" as const,
    contentUrl: "https://example.com/videos/team-building.mp4",
    orderIndex: 3,
  },
  {
    title: "Conflict Resolution",
    description: "Handling disagreements and difficult conversations",
    type: "video" as const,
    contentUrl: "https://example.com/videos/conflict-resolution.mp4",
    orderIndex: 4,
  },
  {
    title: "Strategic Decision Making",
    description: "Framework for making better decisions under pressure",
    type: "video" as const,
    contentUrl: "https://example.com/videos/strategic-decisions.mp4",
    orderIndex: 5,
  },
  {
    title: "Leadership Workbook",
    description: "Exercises and templates for practicing leadership skills",
    type: "pdf" as const,
    contentUrl: "https://example.com/pdfs/leadership-workbook.pdf",
    orderIndex: 6,
  },
];

async function seed() {
  console.log("🌱 Seeding database with digital products...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing products, courses, and modules...");
    await db.delete(courseModules);
    await db.delete(courses);
    await db.delete(products);
    
    // Insert products
    console.log("📦 Inserting digital products...");
    const insertedProducts = await db.insert(products).values(seedProducts).returning();
    console.log(`✅ ${insertedProducts.length} products created`);

    // Create courses for course-type products
    const courseProducts = insertedProducts.filter(p => p.type === "course");
    
    for (const product of courseProducts) {
      console.log(`📚 Creating course for: ${product.name}`);
      const [course] = await db.insert(courses).values({
        productId: product.id,
      }).returning();

      // Add modules based on the course
      let modulesData;
      if (product.name.includes("Web Development")) {
        modulesData = courseModulesData;
      } else if (product.name.includes("Python")) {
        modulesData = pythonModulesData;
      } else {
        modulesData = leadershipModulesData;
      }

      for (const moduleData of modulesData) {
        await db.insert(courseModules).values({
          courseId: course.id,
          ...moduleData,
        });
      }
      console.log(`  ✅ Added ${modulesData.length} modules`);
    }

    // Seed admin
    console.log("👤 Checking if admin exists...");
    const existingAdmin = await db.select().from(admins).where(sql`${admins.email} = 'admin@atlantic.com'`);
    
    if (existingAdmin.length === 0) {
      console.log("👤 Creating admin account...");
      await db.insert(admins).values({
        email: "admin@atlantic.com",
        password: "admin123",
      });
      console.log("✅ Admin created successfully");
    } else {
      console.log("⏭️  Admin already exists, skipping");
    }

    console.log("✅ Database seeded successfully with digital products!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
