export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  author: string;
  readTime: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const fallbackBlogPosts: BlogPost[] = [
  {
    title: 'How to Compress Photos to Exactly 20KB or 50KB for Government Exam Applications',
    slug: 'compress-photos-20kb-50kb-govt-exam',
    excerpt: 'Step-by-step tutorial on meeting strict UPSC, SSC, IBPS, and state board photo and signature size specifications using client-side precision DCT quantization.',
    category: 'Image Tools',
    author: 'ToolsforTools Editorial',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    seoTitle: 'Compress Photos to 20KB / 50KB for UPSC & SSC Exams | ToolsforTools',
    seoDescription: 'Learn how to resize and compress passport photos and signatures to 20KB and 50KB without quality loss or server uploads.',
    createdAt: '2026-10-10T10:00:00.000Z',
    content: `## The Strict Requirements of Sarkari Exam Portals

Every candidate applying for major competitive examinations across India—such as **UPSC Civil Services, SSC CGL/CHSL, IBPS Bank PO, Railway RRB, and State PSCs**—faces a common stumbling block: **strict file size and dimension constraints**.

Most official portals automatically reject uploads that deviate even by 1 Kilobyte:
* **Candidate Photograph:** Typically required between **20KB to 50KB** (maximum 100KB), with 3.5cm x 4.5cm dimensions.
* **Candidate Signature:** Required between **10KB to 20KB**, strictly on a plain white background with black/dark blue ink.

---

### Step 1: Choosing the Right Aspect Ratio
Before adjusting file size, ensure your photo has an aspect ratio of roughly **7:9** (or 350x450 pixels). Crop any extra shoulders or background space so your face occupies 70% to 80% of the frame.

### Step 2: In-Browser DCT Quantization vs. Resizing
Many users attempt to shrink file sizes using generic screenshotting or basic paint tools, which causes blurry text and artifacting. 

ToolsforTools uses **precision Discrete Cosine Transform (DCT) quantization** directly inside your browser:
1. Open the [Target KB Compressor](https://toolsfortools.in/tools/image-compressor).
2. Select your photo.
3. Click the preset badge for **20KB** or **50KB**.
4. The iterative compression algorithm adjusts luminance and chrominance tables until the file size is exactly at or under your target.

---

### Step 3: Zero Server Upload Privacy
Government job applicants often hesitate to upload sensitive identity proofs (Aadhaar cards, PAN cards, original signatures) to third-party web servers. 

With ToolsforTools, your raw photos are processed using the HTML5 Canvas API on your own phone or computer. The file never travels over the internet, ensuring 100% data privacy.

*Ready to prep your application? Use our dedicated [Govt Photo & Signature Studio](https://toolsfortools.in/tools/govt-photo-signature-studio) today!*`,
  },
  {
    title: 'Why Client-Side In-Browser PDF Processing Protects Your Sensitive Documents',
    slug: 'client-side-browser-pdf-processing-privacy',
    excerpt: 'Understand how WebAssembly and client-side JavaScript process PDFs directly on your device, eliminating data leaks, server retention, and compliance risks.',
    category: 'Security & Privacy',
    author: 'Aman Sharma',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    seoTitle: 'Why Client-Side In-Browser PDF Tools Protect Privacy | ToolsforTools',
    seoDescription: 'Discover how WebAssembly and in-browser processing ensure your confidential financial and legal PDFs never get uploaded to third-party servers.',
    createdAt: '2026-10-11T12:30:00.000Z',
    content: `## The Hidden Danger of Traditional Cloud Utility Sites

When you search for "merge PDF" or "compress PDF online," the majority of legacy tools require you to transmit your entire PDF document to their remote cloud server. 

### What Actually Happens to Your Uploaded Documents?
1. **Network Ingestion:** Your file travels across multiple routing hops.
2. **Server Storage:** The PDF is temporarily written to remote disk storage for backend libraries to process.
3. **Retention Policies:** Even if services claim deletion after 1 hour, temporary log snapshots, crash dumps, and unencrypted caches can remain accessible.

For personal bank statements, medical records, legal contracts, or confidential tax filings, this workflow introduces unnecessary privacy vulnerabilities.

---

## The Next-Gen Alternative: WebAssembly & Client-Side Engines

Modern web browsers like Chrome, Edge, Safari, and Firefox now provide native computational engines capable of executing complex document manipulation locally.

At **ToolsforTools**, our document suite utilizes **\`pdf-lib\` compiled to client-side JavaScript**:
* **Direct Memory Stream:** Your PDF is read as an \`ArrayBuffer\` straight from your device storage.
* **In-Memory Operations:** Pages are merged, split, rotated, or numbered in your computer's RAM.
* **Instant Export:** The output PDF is assembled locally into a \`Blob\` and saved through your browser's download manager.

\`\`\`javascript
// Client-side execution example: Zero network requests
const existingPdfBytes = await file.arrayBuffer();
const pdfDoc = await PDFDocument.load(existingPdfBytes);
const newPdf = await PDFDocument.create();
const pages = await newPdf.copyPages(pdfDoc, [0, 1]);
pages.forEach(p => newPdf.addPage(p));
const finalPdfBytes = await newPdf.save();
\`\`\`

### Demonstrable Offline Operation
Because no server compute is required, you can open any ToolsforTools document utility, switch your device to **Airplane Mode**, and continue merging, splitting, and organizing PDFs without interruption!

Try our [Merge PDF Tool](https://toolsfortools.in/tools/merge-pdf) or [Split PDF Tool](https://toolsfortools.in/tools/split-pdf) to experience real client-side performance.`,
  },
  {
    title: 'SIP & Compound Wealth Planning: How Monthly Investments Build Long-Term Portfolios',
    slug: 'sip-compound-wealth-planning-guide',
    excerpt: 'An actionable guide to systematic investment plans (SIP), understanding the power of compounding interest, and calculating long-term retirement wealth.',
    category: 'Finance & Tools',
    author: 'Financial Research Desk',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    seoTitle: 'SIP Investment & Compound Interest Wealth Guide | ToolsforTools',
    seoDescription: 'Calculate expected returns on monthly SIP mutual fund investments using compound interest formulas and inflation planning.',
    createdAt: '2026-10-12T08:15:00.000Z',
    content: `## The Math Behind Systematic Investment Plans (SIP)

A **Systematic Investment Plan (SIP)** is an investment vehicle offered by mutual funds that allows you to invest a fixed amount regularly (monthly or quarterly) rather than making a lump-sum commitment.

### The Compound Interest Wealth Formula
The expected maturity amount of an SIP is calculated using the future value of an annuity formula:

$$M = P \\times \\frac{(1 + i)^n - 1}{i} \\times (1 + i)$$

Where:
* **M** = Final maturity value
* **P** = Amount invested each month
* **i** = Periodic monthly interest rate (Annual return percentage / 12 / 100)
* **n** = Total number of monthly installments

---

### Why Rupee Cost Averaging Matters
When markets dip, your fixed monthly allocation buys more mutual fund units. When markets rise, it buys fewer units. Over a 5, 10, or 20-year horizon, this automatically reduces your average acquisition cost without requiring market-timing skill.

### Test Your Own Retirement Projections
Try our free, private [SIP Calculator](https://toolsfortools.in/tools/sip-calculator) to visualize your compounding curve, compare expected return rates (10% to 16%), and calculate long-term wealth gains.`,
  },
];

export async function fetchAllBlogs(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/blogs`, {
      next: { revalidate: 60 },
      cache: 'default',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return fallbackBlogPosts;
  } catch {
    return fallbackBlogPosts;
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/blogs/${slug}`, {
      next: { revalidate: 60 },
      cache: 'default',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch {
    // ignore
  }

  const match = fallbackBlogPosts.find((p) => p.slug === slug);
  return match || null;
}
