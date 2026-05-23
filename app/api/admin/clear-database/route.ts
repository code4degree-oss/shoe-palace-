import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/admin/clear-database
 * Body: { sections: string[] }
 *   sections can include: "orders", "reviews", "products", "categories",
 *                         "customers", "leads", "banners", "faqs", "results", "uploads"
 *
 * Clears selected data from the database and/or filesystem.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();

  try {
    const { sections } = await req.json();

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one section to clear' },
        { status: 400 }
      );
    }

    const cleared: string[] = [];

    // ── Database tables (order matters for foreign keys) ──

    // Orders → clears OrderItems first (cascade), then Orders
    if (sections.includes('orders')) {
      await prisma.orderItem.deleteMany({});
      await prisma.order.deleteMany({});
      cleared.push('Orders & OrderItems');
    }

    // Reviews
    if (sections.includes('reviews')) {
      await prisma.review.deleteMany({});
      cleared.push('Reviews');
    }

    // Products → clears ComboProducts, OrderItems, Reviews linked to products first
    if (sections.includes('products')) {
      await prisma.comboProduct.deleteMany({});
      // Only delete if not already cleared above
      if (!sections.includes('reviews')) {
        await prisma.review.deleteMany({});
      }
      if (!sections.includes('orders')) {
        await prisma.orderItem.deleteMany({});
      }
      await prisma.combo.deleteMany({});
      await prisma.product.deleteMany({});
      cleared.push('Products, Combos & related data');
    }

    // Categories (must be after products)
    if (sections.includes('categories')) {
      // If products weren't already cleared, we need to clear them first
      if (!sections.includes('products')) {
        await prisma.comboProduct.deleteMany({});
        if (!sections.includes('reviews')) {
          await prisma.review.deleteMany({});
        }
        if (!sections.includes('orders')) {
          await prisma.orderItem.deleteMany({});
        }
        await prisma.combo.deleteMany({});
        await prisma.product.deleteMany({});
        cleared.push('Products (required for category deletion)');
      }
      await prisma.category.deleteMany({});
      cleared.push('Categories');
    }

    // Customers (must be after orders)
    if (sections.includes('customers')) {
      if (!sections.includes('orders')) {
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        cleared.push('Orders (required for customer deletion)');
      }
      if (!sections.includes('reviews')) {
        await prisma.review.deleteMany({});
        cleared.push('Reviews (required for customer deletion)');
      }
      await prisma.customer.deleteMany({});
      cleared.push('Customers');
    }

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    // Leads
    if (sections.includes('leads')) {
      await prisma.lead.deleteMany({});
      cleared.push('Leads');
    }

    // ── JSON data files ──

    if (sections.includes('banners')) {
      const bannersFile = path.join(process.cwd(), 'data', 'banners.json');
      if (fs.existsSync(bannersFile)) {
        fs.writeFileSync(bannersFile, '[]', 'utf-8');
      }
      cleared.push('Banners (JSON)');
    }

    if (sections.includes('faqs')) {
      const faqsFile = path.join(process.cwd(), 'data', 'faqs.json');
      if (fs.existsSync(faqsFile)) {
        fs.writeFileSync(faqsFile, '[]', 'utf-8');
      }
      cleared.push('FAQs (JSON)');
    }

    if (sections.includes('results')) {
      const resultsFile = path.join(process.cwd(), 'data', 'results.json');
      if (fs.existsSync(resultsFile)) {
        fs.writeFileSync(resultsFile, '[]', 'utf-8');
      }
      cleared.push('Results (JSON)');
    }

    // ── Uploaded files ──

    if (sections.includes('uploads')) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (fs.existsSync(uploadsDir)) {
        // Remove all files recursively but keep the directory structure
        const removeFilesRecursive = (dir: string) => {
          if (!fs.existsSync(dir)) return;
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              removeFilesRecursive(fullPath);
            } else {
              fs.unlinkSync(fullPath);
            }
          }
        };
        removeFilesRecursive(uploadsDir);
      }
      cleared.push('Uploaded images (banners, product images)');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleared: ${cleared.join(', ')}`,
      cleared,
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json(
      { error: 'Failed to clear database. Check server logs for details.' },
      { status: 500 }
    );
  }
}
