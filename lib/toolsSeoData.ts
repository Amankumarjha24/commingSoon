// lib/toolsSeoData.ts
// Comprehensive on-page SEO content, FAQs, technical constraints, and related links for all 31 tools.
// Rendered server-side by ToolSeoSection.tsx to ensure 100% crawlability and valid JSON-LD schemas.

import { ToolSeoData } from '@/components/ToolSeoSection';

export const TOOLS_SEO_DATA: Record<string, ToolSeoData> = {
  'geo-tag-changer': {
    slug: 'geo-tag-changer',
    toolName: 'Geo Tag Changer & EXIF GPS Editor Pro',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload Photo', desc: 'Select or drag any JPG, PNG, or WebP photo into the studio.' },
      { stepNumber: 2, title: 'Set Location Coordinates', desc: 'Enter exact Latitude and Longitude decimal coordinates, use "Current GPS", or pick quick city presets (New Delhi, Dubai, London, New York).' },
      { stepNumber: 3, title: 'Specify Custom File Name', desc: 'Give your newly geotagged photo a personalized name (e.g. gateway-of-india.jpg).' },
      { stepNumber: 4, title: 'Apply & Download with Verified EXIF', desc: 'Our binary EXIF engine injects genuine GPS tags directly into the JPEG header with zero server uploads.' }
    ],
    constraints: [
      { label: 'Supported Input Formats', value: 'JPG, JPEG, PNG, WebP' },
      { label: 'EXIF GPS Standards', value: 'GPSVersionID 2.3.0.0, Rational DMS coordinates' },
      { label: 'Privacy', value: '100% In-Browser. Photos and GPS credentials never touch a server' },
      { label: 'Map Compatibility', value: 'Google Maps, Apple Photos, Lightroom, Instagram EXIF' }
    ],
    faqs: [
      { q: 'How to geotag photos online for free?', a: 'Upload your image, enter decimal latitude and longitude coordinates (or choose a city preset), and click "Download with Verified EXIF". The coordinates are encoded directly into the JPEG metadata with zero cloud upload.' },
      { q: 'Does this really change the EXIF GPS metadata inside the photo?', a: 'Yes. It writes genuine binary EXIF tags (GPSLatitude, GPSLongitude, GPSAltitude, GPSDateStamp) conforming to the official EXIF 2.3 standard. Photo apps like Apple Photos, Google Photos, and Adobe Lightroom will recognize the exact pin on their world map.' },
      { q: 'Can I change the location of a photo taken without GPS?', a: 'Yes. Even if your camera or phone had location services disabled, this tool will create a fresh GPS metadata block and embed your chosen coordinates.' },
      { q: 'Are my location credentials or photos stored on your server?', a: 'Never. ToolsforTools processes all image manipulation and EXIF writing locally inside your browser via WebAssembly and JavaScript. Zero data is uploaded to our servers.' }
    ],
    relatedTools: [
      { slug: 'image-metadata-viewer', name: 'EXIF Metadata Viewer', shortDesc: 'Inspect and sanitize camera parameters & GPS tags.' },
      { slug: 'image-compressor', name: 'Image Compressor Pro', shortDesc: 'Compress photos to target KB while preserving resolution.' },
      { slug: 'image-converter', name: 'Image Format Converter', shortDesc: 'Convert between PNG, JPG, and WebP instantly.' }
    ]
  },
  'qr-generator': {
    slug: 'qr-generator',
    toolName: 'QR Code Generator Pro',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Choose QR Data Type', desc: 'Select from Website URL, Wi-Fi Network auto-connect, Plain Text, Email, Phone call, or WhatsApp chat link.' },
      { stepNumber: 2, title: 'Enter Content & Credentials', desc: 'Input your link or Wi-Fi credentials (SSID and password). Your data is encoded 100% inside your browser.' },
      { stepNumber: 3, title: 'Customize Colors & Error Level', desc: 'Choose custom foreground and background colors to match your brand, and set Reed-Solomon error correction.' },
      { stepNumber: 4, title: 'Export in High Resolution', desc: 'Download your scannable QR code as a 1024px print-ready PNG or infinite-resolution vector SVG file.' }
    ],
    constraints: [
      { label: 'QR Specification', value: 'ISO/IEC 18004 Standard compliant' },
      { label: 'Wi-Fi Protocol', value: 'WPA/WPA2, WEP, and Open Networks supported' },
      { label: 'Export Formats', value: 'PNG (1024px Retina) & SVG (Vector)' },
      { label: 'Privacy', value: '100% Client-Side browser generation (zero cloud tracking)' }
    ],
    faqs: [
      { q: 'Does this QR code expire or require a subscription?', a: 'No. All QR codes generated here are static, standard ISO/IEC 18004 QR codes. They embed your actual text, Wi-Fi credentials, or URL directly into the matrix, so they never expire and do not redirect through third-party servers.' },
      { q: 'How does the Wi-Fi QR code work when scanned?', a: 'When an iPhone or Android phone camera scans the Wi-Fi QR code, it reads the standard WIFI:T:WPA;S:... protocol and prompts the user: "Join Wi-Fi Network?". The device connects automatically without typing passwords.' },
      { q: 'Can I print these QR codes on business cards and posters?', a: 'Yes. You can export as a vector SVG file for infinite sharpness at any print size, or as a high-density 1024px PNG.' }
    ],
    relatedTools: [
      { slug: 'ocr-text-extractor', name: 'OCR Text Extractor', shortDesc: 'Extract printed or handwritten text from images with AI.' },
      { slug: 'image-metadata-viewer', name: 'EXIF Metadata Viewer', shortDesc: 'Inspect and scrub hidden GPS location and camera tags.' },
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Convert between JSON, YAML, XML, and CSV formats.' }
    ]
  },
  'protect-pdf': {
    slug: 'protect-pdf',
    toolName: 'Protect PDF (AES-256 Encryption)',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Select PDF Document', desc: 'Upload any standard PDF document from your phone or computer.' },
      { stepNumber: 2, title: 'Set Strong Password', desc: 'Enter and confirm a secure password to encrypt your document.' },
      { stepNumber: 3, title: 'Encrypt with AES-256', desc: 'Our engine applies standard 256-bit AES cryptographic protection directly in your browser.' },
      { stepNumber: 4, title: 'Download Protected PDF', desc: 'Download your encrypted PDF. Any PDF viewer will strictly require the password to unlock it.' }
    ],
    constraints: [
      { label: 'Cipher Algorithm', value: 'Standard AES-256 military-grade encryption' },
      { label: 'Supported Viewers', value: 'Adobe Acrobat, Chrome, Safari, Preview, Edge' },
      { label: 'Max File Size', value: 'Up to 150MB client-side RAM memory limit' },
      { label: 'Privacy', value: '100% In-Browser. Files never leave your local device' }
    ],
    faqs: [
      { q: 'Can anyone open my PDF without the password?', a: 'No. The file binary is encrypted with AES-256. Standard PDF readers like Adobe Acrobat, Apple Preview, and Google Chrome require the exact password before decrypting the file contents.' },
      { q: 'Can I remove the password later?', a: 'Yes. Use our companion tool "Unlock PDF" with your password to produce a decrypted, restriction-free version.' }
    ],
    relatedTools: [
      { slug: 'unlock-pdf', name: 'Unlock PDF', shortDesc: 'Decrypt password-protected PDFs.' },
      { slug: 'compress-pdf', name: 'Compress PDF', shortDesc: 'Reduce PDF file size.' },
      { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple PDF documents into one.' }
    ]
  },
  'unlock-pdf': {
    slug: 'unlock-pdf',
    toolName: 'Unlock PDF (Decrypt & Remove Passwords)',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Upload Password-Protected PDF', desc: 'Select the encrypted PDF you have permission to unlock.' },
      { stepNumber: 2, title: 'Enter Password', desc: 'Provide the document password (or leave blank if stripping owner restrictions).' },
      { stepNumber: 3, title: 'Decrypt In-Browser', desc: 'The client-side engine decrypts the document and clears all permission locks.' },
      { stepNumber: 4, title: 'Download Clean PDF', desc: 'Save an unrestricted PDF that opens instantly without password prompts.' }
    ],
    constraints: [
      { label: 'Supported Encryption', value: 'AES-128, AES-256, and RC4 password-protected PDFs' },
      { label: 'Permissions Stripped', value: 'Printing, editing, content copying, and form filling restrictions removed' },
      { label: 'Zero Uploads', value: 'Decryption happens 100% in your browser' }
    ],
    faqs: [
      { q: 'Can I unlock a PDF without knowing the password?', a: 'If the PDF only has permission/owner restrictions (e.g. printing or copying disabled), you can unlock it without a password. If the PDF requires a password to open, you must provide the authorized password once to decrypt the file stream.' }
    ],
    relatedTools: [
      { slug: 'protect-pdf', name: 'Protect PDF', shortDesc: 'Encrypt PDFs with strong AES-256 passwords.' },
      { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple PDF files into one.' },
      { slug: 'split-pdf', name: 'Split PDF', shortDesc: 'Extract pages and ranges from PDF files.' }
    ]
  },
  'image-metadata-viewer': {
    slug: 'image-metadata-viewer',
    toolName: 'EXIF Metadata Viewer & Stripper',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Select Photo', desc: 'Upload any JPEG, PNG, or WebP photo to read its underlying technical metadata.' },
      { stepNumber: 2, title: 'Inspect EXIF & GPS Coordinates', desc: 'View camera model, shutter speed, ISO, focal length, and exact embedded GPS latitude/longitude.' },
      { stepNumber: 3, title: 'Sanitize Metadata', desc: 'Click "Sanitize & Strip" to wipe all GPS, device serial, and personal tags before sharing publicly.' },
      { stepNumber: 4, title: 'Save Clean File', desc: 'Download your privacy-safe image with zero tracking metadata.' }
    ],
    constraints: [
      { label: 'Supported Formats', value: 'JPEG, JPG, PNG, WebP' },
      { label: 'EXIF Tags Detected', value: 'Camera Make, Model, ISO, Shutter, GPS Coordinates, Timestamp' },
      { label: 'Privacy Guarantee', value: '100% Client-Side. Photos never uploaded to any server' }
    ],
    faqs: [
      { q: 'Why should I remove EXIF metadata before posting photos?', a: 'Smartphones and modern cameras automatically embed your exact GPS location, camera serial number, and timestamp into photos. Scrubbing EXIF protects your home address and privacy before uploading to social networks or forums.' },
      { q: 'Can I add custom GPS coordinates to a photo?', a: 'Yes! Use our companion tool "Geo Tag Changer" to inject or modify GPS latitude, longitude, and altitude in any photo.' }
    ],
    relatedTools: [
      { slug: 'geo-tag-changer', name: 'Geo Tag Changer Pro', shortDesc: 'Inject or modify GPS latitude & longitude EXIF coordinates.' },
      { slug: 'image-compressor', name: 'Image Compressor', shortDesc: 'Reduce photo file size to exact target KB.' },
      { slug: 'image-converter', name: 'Image Format Converter', shortDesc: 'Convert photos between JPG, PNG, and WebP.' }
    ]
  },
  'video-to-gif': {
    slug: 'video-to-gif',
    toolName: 'Video to Animated GIF Converter',
    category: 'video',
    categoryLabel: 'Video & Audio',
    steps: [
      { stepNumber: 1, title: 'Upload Video File', desc: 'Select any MP4, WebM, MOV, or MKV video file directly in your browser.' },
      { stepNumber: 2, title: 'Adjust GIF FPS & Duration', desc: 'Set frame rate (8, 10, or 15 FPS) and clip duration to optimize loop smoothness and file size.' },
      { stepNumber: 3, title: 'Encode Real Animated GIF', desc: 'Our client-side GIF89a engine quantizes frames and builds a repeating animated .gif file.' },
      { stepNumber: 4, title: 'Download GIF & Frames', desc: 'Download your looping .gif file or export all extracted PNG frames in a ZIP package.' }
    ],
    constraints: [
      { label: 'Supported Video Types', value: 'MP4, WebM, MOV, AVI' },
      { label: 'Output Formats', value: 'Animated GIF (.gif) & Frames Archive (.zip)' },
      { label: 'Loop Setting', value: 'Infinite loop (loop: 0 standard GIF89a)' },
      { label: 'Privacy', value: '100% In-Browser. Videos are never uploaded to any server' }
    ],
    faqs: [
      { q: 'Does this create a real .gif file or just images?', a: 'It generates a genuine, standard animated .gif file that automatically loops in WhatsApp, Discord, Slack, and any browser. You can also download the individual frame images in a ZIP.' }
    ],
    relatedTools: [
      { slug: 'trim-video', name: 'Video Trimmer', shortDesc: 'Cut and trim video segments with millisecond precision.' },
      { slug: 'mute-video', name: 'Mute Video Audio', shortDesc: 'Remove unwanted audio tracks from video files.' },
      { slug: 'video-to-audio-extractor', name: 'Video to Audio Extractor', shortDesc: 'Extract high-fidelity MP3 and WAV audio streams.' }
    ]
  },
  'image-compressor': {
    slug: 'image-compressor',
    toolName: 'Target KB Image Compressor',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload Image', desc: 'Select or drag your JPG, PNG, or WebP photo or signature.' },
      { stepNumber: 2, title: 'Choose Target KB', desc: 'Pick preset 20KB, 50KB, 100KB, or type your exact desired target size in kilobytes.' },
      { stepNumber: 3, title: 'Compress In-Browser', desc: 'Binary search DCT quantization compresses file size while maintaining maximum resolution.' },
      { stepNumber: 4, title: 'Download Compliant Photo', desc: 'Save your compressed photo ready for government portal upload.' }
    ],
    constraints: [
      { label: 'Target Presets', value: '20KB, 50KB, 100KB, 200KB or custom KB' },
      { label: 'Algorithm', value: 'Binary-search iterative DCT quality quantization' },
      { label: 'Portal Compliance', value: 'UPSC, SSC, IBPS, State PSC, NEET, JEE exam portals' }
    ],
    faqs: [
      { q: 'How can I compress an image to exactly 20KB or 50KB online?', a: 'Upload your photo, select the 20KB or 50KB preset, and our in-browser DCT quantization engine automatically optimizes JPEG quality until the exact file size is achieved without blur.' },
      { q: 'How to reduce photo and signature size in KB for UPSC, SSC, and govt exam portals?', a: 'Upload your passport photo or signature image, pick 20KB or 50KB, and download. The file strictly satisfies all official application portal file-size restrictions.' },
      { q: 'Why do government portals reject photos over 50KB?', a: 'Application portals have strict file size validators to save server bandwidth. Our compressor optimizes quality to ensure your file falls strictly under the maximum allowed threshold.' }
    ],
    relatedTools: [
      { slug: 'govt-photo-signature-studio', name: 'Govt Form Photo & Signature', shortDesc: 'Crop 3.5x4.5cm photos & signatures.' },
      { slug: 'image-resizer', name: 'Image Resizer', shortDesc: 'Resize photos to custom width and height.' },
      { slug: 'image-converter', name: 'Image Format Converter', shortDesc: 'Convert between PNG, JPG, and WebP.' }
    ]
  },
  'merge-pdf': {
    slug: 'merge-pdf',
    toolName: 'Merge PDF Files Pro',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Select PDF Documents', desc: 'Choose 2 or more PDF files from your device.' },
      { stepNumber: 2, title: 'Arrange Document Order', desc: 'Review the document order and remove or add files as needed.' },
      { stepNumber: 3, title: 'Merge Files Locally', desc: 'The engine combines all pages into a unified document.' },
      { stepNumber: 4, title: 'Download Merged PDF', desc: 'Save your combined PDF with zero watermarks.' }
    ],
    constraints: [
      { label: 'Max Files', value: 'Combine unlimited PDF files within device memory' },
      { label: 'Recommended Limit', value: 'Up to 150MB total document volume' },
      { label: 'Privacy', value: '100% In-Browser. Files never leave your local computer' }
    ],
    faqs: [
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'There are no artificial limits. You can combine as many PDFs as your browser memory allows.' }
    ],
    relatedTools: [
      { slug: 'split-pdf', name: 'Split PDF Pro', shortDesc: 'Extract pages and ranges from PDF files.' },
      { slug: 'compress-pdf', name: 'Compress PDF', shortDesc: 'Reduce PDF file size.' },
      { slug: 'organize-pdf', name: 'Organize PDF', shortDesc: 'Reorder, rotate, and delete PDF pages.' }
    ]
  },
  'split-pdf': {
    slug: 'split-pdf',
    toolName: 'PDF Splitter Pro',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Upload PDF Document', desc: 'Select the PDF file you wish to divide.' },
      { stepNumber: 2, title: 'Specify Page Ranges', desc: 'Choose between custom ranges (e.g. 1-3, 5, 8-10), every single page, or fixed intervals.' },
      { stepNumber: 3, title: 'Process In-Browser', desc: 'The client-side engine parses pages and packages them into clean PDFs.' },
      { stepNumber: 4, title: 'Download ZIP or PDF', desc: 'Save your extracted documents instantly.' }
    ],
    constraints: [
      { label: 'Range Syntax', value: 'Supports commas and hyphens (e.g. 1-4, 7, 9-12)' },
      { label: 'Export Options', value: 'Single PDF or ZIP archive of individual pages' },
      { label: 'Privacy', value: '100% Private In-Browser execution' }
    ],
    faqs: [
      { q: 'Can I extract non-consecutive pages?', a: 'Yes. Type page numbers separated by commas, such as 1, 3, 5, 7, or ranges like 2-6.' }
    ],
    relatedTools: [
      { slug: 'merge-pdf', name: 'Merge PDF Pro', shortDesc: 'Combine multiple PDF files into one.' },
      { slug: 'organize-pdf', name: 'Organize PDF', shortDesc: 'Reorder, rotate, and delete PDF pages visually.' },
      { slug: 'compress-pdf', name: 'Compress PDF', shortDesc: 'Reduce PDF document file size.' }
    ]
  },
  'compress-pdf': {
    slug: 'compress-pdf',
    toolName: 'Compress PDF File Size Pro',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Select PDF File', desc: 'Choose the PDF you want to optimize.' },
      { stepNumber: 2, title: 'Analyze Structure', desc: 'The tool inspects embedded images, fonts, and object streams.' },
      { stepNumber: 3, title: 'Apply Object Streams Optimization', desc: 'Redundant metadata and object cross-references are compacted.' },
      { stepNumber: 4, title: 'Download Compact PDF', desc: 'Download your smaller PDF ready for email and portal upload.' }
    ],
    constraints: [
      { label: 'Compression Mechanism', value: 'PDF Object Stream Cross-Reference Compaction' },
      { label: 'Quality Retention', value: 'Vector text and fonts remain 100% razor sharp' },
      { label: 'Privacy', value: 'Zero cloud upload. Processed locally in memory' }
    ],
    faqs: [
      { q: 'Will compressing my PDF blur the text?', a: 'No. Vector fonts and lines retain their native mathematical sharpness.' }
    ],
    relatedTools: [
      { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple PDF documents.' },
      { slug: 'split-pdf', name: 'Split PDF Pro', shortDesc: 'Extract pages from PDF documents.' },
      { slug: 'protect-pdf', name: 'Protect PDF', shortDesc: 'Encrypt PDF with AES-256 password.' }
    ]
  },
  'organize-pdf': {
    slug: 'organize-pdf',
    toolName: 'PDF Page Organizer Pro',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Upload Document', desc: 'Select the PDF you want to rearrange.' },
      { stepNumber: 2, title: 'Reorder & Rotate Pages', desc: 'Drag pages into your desired order, rotate upside-down pages 90° or 180°, and delete pages.' },
      { stepNumber: 3, title: 'Export Organized PDF', desc: 'Save your reorganized document in seconds.' }
    ],
    constraints: [
      { label: 'Interactive Controls', value: 'Visual thumbnail drag-and-drop, 90° clockwise/counter-clockwise rotation, 1-click delete' },
      { label: 'Privacy', value: '100% Client-Side. Documents never leave your browser' }
    ],
    faqs: [
      { q: 'Can I rotate individual pages without rotating the whole document?', a: 'Yes. Each page has its own rotation button, allowing you to fix scanned upside-down landscape pages.' }
    ],
    relatedTools: [
      { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple PDF documents.' },
      { slug: 'split-pdf', name: 'Split PDF', shortDesc: 'Extract specific pages.' },
      { slug: 'pdf-watermark-number', name: 'PDF Watermark & Numbering', shortDesc: 'Add stamps and page numbers.' }
    ]
  },
  'image-pdf-converter': {
    slug: 'image-pdf-converter',
    toolName: 'Image ↔ PDF Converter Pro',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Select Images or PDF', desc: 'Choose photos to convert to PDF, or a PDF to extract pages as images.' },
      { stepNumber: 2, title: 'Configure Margins & Fit', desc: 'Set page orientation (portrait/landscape) and fit options (A4 fit or original aspect).' },
      { stepNumber: 3, title: 'Convert In-Browser', desc: 'High-speed local rendering generates your output file.' },
      { stepNumber: 4, title: 'Download Converted File', desc: 'Save your combined PDF or extracted high-res JPG images.' }
    ],
    constraints: [
      { label: 'Supported Image Inputs', value: 'JPG, JPEG, PNG, WebP, GIF, BMP' },
      { label: 'Page Formats', value: 'Standard A4, Letter, and Custom aspect ratio fit' }
    ],
    faqs: [
      { q: 'Can I combine multiple photos into a single PDF?', a: 'Yes. Upload all your photos together, reorder them, and click Convert to generate a single multi-page PDF.' }
    ],
    relatedTools: [
      { slug: 'combine-images-collage', name: 'Combine Images Collage', shortDesc: 'Stitch photos side-by-side or in a grid.' },
      { slug: 'merge-pdf', name: 'Merge PDF Pro', shortDesc: 'Combine multiple PDF files into one.' },
      { slug: 'image-compressor', name: 'Image Compressor', shortDesc: 'Compress photos to target KB.' }
    ]
  },
  'pdf-watermark-number': {
    slug: 'pdf-watermark-number',
    toolName: 'PDF Watermark & Page Numbering Tool',
    category: 'pdf',
    categoryLabel: 'PDF Suite',
    steps: [
      { stepNumber: 1, title: 'Upload PDF', desc: 'Choose the PDF document that needs stamping or page numbers.' },
      { stepNumber: 2, title: 'Configure Stamp or Numbering', desc: 'Enter custom text (CONFIDENTIAL, DRAFT, copyright) or choose Bates page numbering (Page X of Y).' },
      { stepNumber: 3, title: 'Adjust Position & Opacity', desc: 'Set diagonal angle, font size, color, and transparency.' },
      { stepNumber: 4, title: 'Download Stamped PDF', desc: 'Save your professionally marked document.' }
    ],
    constraints: [
      { label: 'Watermark Styles', value: 'Diagonal 45° stamp, header text, footer page numbers' },
      { label: 'Numbering Formats', value: 'Page X of Y, Bates numbering, simple arabic numerals' }
    ],
    faqs: [
      { q: 'Can the watermark be removed by other users?', a: 'Watermark text is embedded directly into the vector content stream of each page, making it permanent across viewers.' }
    ],
    relatedTools: [
      { slug: 'protect-pdf', name: 'Protect PDF', shortDesc: 'Encrypt PDF with AES-256 password.' },
      { slug: 'organize-pdf', name: 'Organize PDF', shortDesc: 'Reorder and rotate pages.' },
      { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple documents.' }
    ]
  },
  'profile-photo-maker': {
    slug: 'profile-photo-maker',
    toolName: 'Profile Photo Maker & Avatar Studio',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload Picture', desc: 'Select any selfie or portrait photo.' },
      { stepNumber: 2, title: 'Adjust Circular Crop', desc: 'Position and zoom your face inside the circular viewport.' },
      { stepNumber: 3, title: 'Add Gradient Border & Badges', desc: 'Choose from vibrant Instagram/LinkedIn gradient rings, solid borders, and background tints.' },
      { stepNumber: 4, title: 'Download High-Res Avatar', desc: 'Export transparent PNG or crisp circular profile picture.' }
    ],
    constraints: [
      { label: 'Export Resolution', value: 'High-density 800×800px circular PNG with transparency' },
      { label: 'Border Styles', value: 'Instagram gradient ring, neon glow, solid color, badge overlays' }
    ],
    faqs: [
      { q: 'Will this fit WhatsApp and LinkedIn profile pictures?', a: 'Yes. The circular crop perfectly matches the avatar dimensions used by WhatsApp, Instagram, LinkedIn, and Twitter.' }
    ],
    relatedTools: [
      { slug: 'govt-photo-signature-studio', name: 'Govt Photo & Signature', shortDesc: 'Crop official passport photos.' },
      { slug: 'image-filters-studio', name: 'Photo Filters Studio', shortDesc: 'Apply vintage & B&W filters.' },
      { slug: 'image-resizer', name: 'Image Resizer', shortDesc: 'Resize photos to exact dimensions.' }
    ]
  },
  'image-filters-studio': {
    slug: 'image-filters-studio',
    toolName: 'Photo Filters & B&W Studio',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload Image', desc: 'Select any photo to apply visual filter effects.' },
      { stepNumber: 2, title: 'Choose Filter Preset', desc: 'Select Grayscale (B&W), Sepia, Vintage film, Invert, Blur, or high-contrast styles.' },
      { stepNumber: 3, title: 'Compare Before & After', desc: 'Slide the interactive comparison handle to evaluate adjustments.' },
      { stepNumber: 4, title: 'Download Filtered Image', desc: 'Export at full original resolution.' }
    ],
    constraints: [
      { label: 'Shader Pipeline', value: 'Client-side HTML5 2D Canvas pixel matrix transformations' },
      { label: 'Resolution', value: 'Full camera resolution preserved without downscaling' }
    ],
    faqs: [
      { q: 'Does this compress or degrade my photo quality?', a: 'No. The image is processed at its native pixel resolution.' }
    ],
    relatedTools: [
      { slug: 'photopea-editor', name: 'Photopea Studio Pro', shortDesc: 'Full Photoshop PSD alternative.' },
      { slug: 'meme-maker', name: 'Meme Maker', shortDesc: 'Add captions and funny templates.' },
      { slug: 'profile-photo-maker', name: 'Profile Photo Maker', shortDesc: 'Create circular avatars with borders.' }
    ]
  },
  'meme-maker': {
    slug: 'meme-maker',
    toolName: 'Meme Maker & Viral Captioner',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload or Pick Template', desc: 'Choose a trending viral template or upload your own image.' },
      { stepNumber: 2, title: 'Add Top & Bottom Captions', desc: 'Type your punchlines with classic bold Impact meme typography.' },
      { stepNumber: 3, title: 'Customize Text & Stickers', desc: 'Adjust font size, text outline strokes, and sticker overlays.' },
      { stepNumber: 4, title: 'Download & Share', desc: 'Save high-res meme ready for social media.' }
    ],
    constraints: [
      { label: 'Typography', value: 'Classic Impact font with customizable black outline stroke' },
      { label: 'Watermark', value: 'Zero watermarks. 100% clean export' }
    ],
    faqs: [
      { q: 'Can I create memes on my mobile phone?', a: 'Yes. The interface is fully touch-optimized for mobile browsers.' }
    ],
    relatedTools: [
      { slug: 'combine-images-collage', name: 'Combine Images Collage', shortDesc: 'Stitch memes and reaction photos side-by-side.' },
      { slug: 'image-filters-studio', name: 'Photo Filters Studio', shortDesc: 'Apply visual filters to photos.' },
      { slug: 'video-to-gif', name: 'Video to GIF Converter', shortDesc: 'Create looping animated reaction GIFs.' }
    ]
  },
  'combine-images-collage': {
    slug: 'combine-images-collage',
    toolName: 'Combine Images & Collage Maker',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Select Photos', desc: 'Upload multiple images to stitch together.' },
      { stepNumber: 2, title: 'Choose Layout', desc: 'Pick Horizontal side-by-side, Vertical stack, or 2/3 column Grid layout.' },
      { stepNumber: 3, title: 'Adjust Spacing & Background', desc: 'Set padding gap, border spacing, and background color.' },
      { stepNumber: 4, title: 'Download Combined Image', desc: 'Export your high-resolution collage in 1 click.' }
    ],
    constraints: [
      { label: 'Layout Modes', value: 'Horizontal side-by-side, Vertical column, 2×2 and 3×3 Grid' },
      { label: 'Backgrounds', value: 'Custom solid color background canvas' }
    ],
    faqs: [
      { q: 'How many images can I combine together?', a: 'You can combine 2 to 12 images in a clean collage grid.' }
    ],
    relatedTools: [
      { slug: 'meme-maker', name: 'Meme Maker', shortDesc: 'Add captions and meme text.' },
      { slug: 'image-pdf-converter', name: 'Image to PDF Converter', shortDesc: 'Convert photos to a combined PDF.' },
      { slug: 'image-resizer', name: 'Image Resizer', shortDesc: 'Resize photos to custom dimensions.' }
    ]
  },
  'govt-photo-signature-studio': {
    slug: 'govt-photo-signature-studio',
    toolName: 'Govt Form Photo & Signature Studio',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Select Photo or Signature', desc: 'Upload your raw passport portrait or scanned signature.' },
      { stepNumber: 2, title: 'Crop to Official Standard', desc: 'Crop to 3.5×4.5 cm (passport) or 2.0×4.0 cm (signature) with automatic white background enhancement.' },
      { stepNumber: 3, title: 'Select Target Portal KB', desc: 'Lock file size to exact 20KB, 50KB, or 100KB limits required by exam boards.' },
      { stepNumber: 4, title: 'Export File or Print Sheet', desc: 'Download compliant image or printable 4×6 / A4 multi-photo print sheets.' }
    ],
    constraints: [
      { label: 'Standard Dimensions', value: '3.5×4.5 cm (Passport photo), 2.0×4.0 cm (Signature)' },
      { label: 'Exam Portals Covered', value: 'UPSC, SSC CGL/CHSL, IBPS, State PSC, Police Recruitment, NEET, JEE' },
      { label: 'Print Layouts', value: 'Single crop, 4×6 photo sheet (8 photos), A4 sheet (32 photos)' }
    ],
    faqs: [
      { q: 'How do I create a compliant passport size photo online?', a: 'Upload your portrait, select the UPSC/SSC preset (200x230 px at 3.5x4.5 cm), set pure white background, and export. The output complies with all official portal dimensions and size constraints.' },
      { q: 'How to resize signature to 10KB - 20KB for online exam forms?', a: 'Upload your signature photo on white paper. The studio auto-cleans ink contrast, whitens paper shadows, crops to 140x60 px, and keeps the file size strictly between 10KB to 20KB.' },
      { q: 'Will this photo pass SSC/UPSC online portal checks?', a: 'Yes. The dimensions, aspect ratio, and file size are locked to the exact portal specifications.' }
    ],
    relatedTools: [
      { slug: 'image-compressor', name: 'Target KB Image Compressor', shortDesc: 'Compress photos to exact 20KB/50KB.' },
      { slug: 'image-resizer', name: 'Image Resizer Pro', shortDesc: 'Resize images by pixels or cm.' },
      { slug: 'profile-photo-maker', name: 'Profile Photo Maker', shortDesc: 'Create circular avatars.' }
    ]
  },
  'photopea-editor': {
    slug: 'photopea-editor',
    toolName: 'Photopea Studio Pro',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Open File or Create New', desc: 'Open PSD, XCF, Sketch, RAW, or standard image files.' },
      { stepNumber: 2, title: 'Edit with Layer Tools', desc: 'Use adjustment layers, masks, clone stamp, pen tool, and raster brushes.' },
      { stepNumber: 3, title: 'Export File', desc: 'Save as PSD, PNG, JPG, SVG, or WebP directly to your device.' }
    ],
    constraints: [
      { label: 'File Compatibility', value: 'PSD, XCF, Sketch, XD, CDR, RAW, PDF, SVG, PNG, JPG' },
      { label: 'Processing Architecture', value: 'Client-Side WebAssembly graphics engine (Zero cloud uploads)' }
    ],
    faqs: [
      {
        q: 'Does Photopea upload my photos or PSD files to any server?',
        a: 'Never. Photopea runs entirely on the client side inside your web browser via WebAssembly. When you open an image or PSD, the file is loaded directly into your computer RAM and processed by your local graphics hardware. Your files are never uploaded to any remote server or cloud storage, ensuring absolute privacy for your personal documents and creative assets.'
      },
      {
        q: 'Can I continue editing if I disconnect from the internet?',
        a: 'Yes. Because the entire editing engine executes locally on your machine, you can disconnect your Wi-Fi after opening the page and continue creating layers, applying filters, and exporting your finished artwork seamlessly offline.'
      },
      {
        q: 'Is Photopea free to use without software installation?',
        a: 'Yes. It delivers complete professional layer-based editing, mask support, and Photoshop PSD compatibility directly in your web browser without requiring heavy desktop installations or paid licenses.'
      }
    ],
    relatedTools: [
      { slug: 'image-filters-studio', name: 'Photo Filters Studio', shortDesc: 'Quick image filters & B&W effects.' },
      { slug: 'image-converter', name: 'Image Format Converter', shortDesc: 'Convert between PNG, JPG, and WebP.' },
      { slug: 'meme-maker', name: 'Meme Maker', shortDesc: 'Create memes with top/bottom text.' }
    ]
  },
  'image-converter': {
    slug: 'image-converter',
    toolName: 'Image Format Converter Pro',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Select Images', desc: 'Upload one or multiple photos to convert.' },
      { stepNumber: 2, title: 'Pick Target Format', desc: 'Choose between WebP, PNG, JPG, GIF, or BMP.' },
      { stepNumber: 3, title: 'Adjust Quality', desc: 'Set quality slider for lossy formats or choose lossless PNG.' },
      { stepNumber: 4, title: 'Download Converted Photos', desc: 'Save individual files or a combined ZIP archive.' }
    ],
    constraints: [
      { label: 'Supported Inputs', value: 'PNG, JPG, JPEG, WebP, GIF, BMP, SVG' },
      { label: 'Supported Outputs', value: 'WebP (Modern Web), PNG (Lossless), JPG (Universal), BMP' }
    ],
    faqs: [
      { q: 'Why convert images to WebP?', a: 'WebP provides 25-35% smaller file sizes than JPEG at equivalent visual quality, speeding up web page loading.' }
    ],
    relatedTools: [
      { slug: 'image-compressor', name: 'Image Compressor', shortDesc: 'Reduce file size to exact target KB.' },
      { slug: 'image-resizer', name: 'Image Resizer', shortDesc: 'Resize photos to custom dimensions.' },
      { slug: 'video-to-gif', name: 'Video to GIF Converter', shortDesc: 'Convert videos to looping GIFs.' }
    ]
  },
  'image-resizer': {
    slug: 'image-resizer',
    toolName: 'Image Resizer Pro',
    category: 'image',
    categoryLabel: 'Photo & Image',
    steps: [
      { stepNumber: 1, title: 'Upload Image', desc: 'Select the photo you need to resize.' },
      { stepNumber: 2, title: 'Set Width & Height', desc: 'Input custom dimensions in pixels or percentage, with aspect ratio lock enabled.' },
      { stepNumber: 3, title: 'Resize In-Browser', desc: 'Bilinear resampling smoothly scales your image without pixelation.' },
      { stepNumber: 4, title: 'Download Resized Image', desc: 'Save your optimized photo ready for use.' }
    ],
    constraints: [
      { label: 'Dimension Units', value: 'Pixels (px) and Percentage (%)' },
      { label: 'Aspect Ratio', value: 'Lock aspect ratio or set freeform custom width & height' }
    ],
    faqs: [
      { q: 'Will resizing make my image blurry?', a: 'Downscaling preserves clarity. When upscaling, our bilinear resampling minimizes blurriness.' }
    ],
    relatedTools: [
      { slug: 'image-compressor', name: 'Image Compressor', shortDesc: 'Compress photos to target KB.' },
      { slug: 'govt-photo-signature-studio', name: 'Govt Photo Studio', shortDesc: 'Crop official passport photos.' },
      { slug: 'image-converter', name: 'Image Format Converter', shortDesc: 'Convert between PNG, JPG, WebP.' }
    ]
  },
  'mute-video': {
    slug: 'mute-video',
    toolName: 'Mute Video Online (Audio Stripper)',
    category: 'video',
    categoryLabel: 'Video & Audio',
    steps: [
      { stepNumber: 1, title: 'Upload Video', desc: 'Select any MP4, WebM, or MOV video clip.' },
      { stepNumber: 2, title: 'Strip Sound Track', desc: 'The client-side stream processor captures silent visual frames.' },
      { stepNumber: 3, title: 'Download Muted Video', desc: 'Save your silent video file with zero server uploads.' }
    ],
    constraints: [
      { label: 'Supported Formats', value: 'MP4, WebM, MOV' },
      { label: 'Output Codec', value: 'H.264 / WebM video stream with null audio channel' }
    ],
    faqs: [
      { q: 'Why mute video before uploading to social media?', a: 'Removing background chatter, wind noise, or copyrighted music avoids copyright strikes and improves engagement.' }
    ],
    relatedTools: [
      { slug: 'trim-video', name: 'Video Trimmer', shortDesc: 'Cut and trim video segments.' },
      { slug: 'video-to-audio-extractor', name: 'Video to Audio Extractor', shortDesc: 'Extract audio from video files.' },
      { slug: 'video-to-gif', name: 'Video to GIF Converter', shortDesc: 'Convert video to looping animated GIF.' }
    ]
  },
  'trim-video': {
    slug: 'trim-video',
    toolName: 'Video Timeline Trimmer Pro',
    category: 'video',
    categoryLabel: 'Video & Audio',
    steps: [
      { stepNumber: 1, title: 'Upload Video', desc: 'Select any video file to trim.' },
      { stepNumber: 2, title: 'Set Start & End Timestamps', desc: 'Drag the timeline scrubber to define your exact clip boundaries.' },
      { stepNumber: 3, title: 'Trim In-Browser', desc: 'The local stream recorder captures only the selected segment.' },
      { stepNumber: 4, title: 'Download Trimmed Video', desc: 'Save your trimmed video clip in high quality.' }
    ],
    constraints: [
      { label: 'Precision', value: 'Millisecond accurate timeline seek and trim' },
      { label: 'Watermark', value: 'Zero watermarks. Completely free and private' }
    ],
    faqs: [
      { q: 'Do large videos get uploaded to your server?', a: 'No. All trimming and frame capture happens locally on your computer or phone.' }
    ],
    relatedTools: [
      { slug: 'mute-video', name: 'Mute Video Audio', shortDesc: 'Remove unwanted audio from video clips.' },
      { slug: 'video-to-gif', name: 'Video to GIF Converter', shortDesc: 'Convert trimmed video into animated GIF.' },
      { slug: 'video-to-audio-extractor', name: 'Video to Audio Extractor', shortDesc: 'Extract MP3/WAV audio.' }
    ]
  },
  'video-to-audio-extractor': {
    slug: 'video-to-audio-extractor',
    toolName: 'Video to Audio Extractor (MP3 & WAV)',
    category: 'video',
    categoryLabel: 'Video & Audio',
    steps: [
      { stepNumber: 1, title: 'Select Video File', desc: 'Upload your MP4, WebM, or MOV video.' },
      { stepNumber: 2, title: 'Choose Audio Format', desc: 'Pick lossless WAV (studio quality) or lightweight MP3 format.' },
      { stepNumber: 3, title: 'Extract Audio Stream', desc: 'Web Audio API decodes audio samples directly in browser memory.' },
      { stepNumber: 4, title: 'Download Audio Track', desc: 'Save your extracted audio file.' }
    ],
    constraints: [
      { label: 'Audio Engine', value: 'Web Audio API AudioContext with RIFF WAVE PCM binary encoder' },
      { label: 'Sample Rates', value: '44.1 kHz / 48 kHz stereo & mono audio output' }
    ],
    faqs: [
      { q: 'Can I extract songs from video lectures or concerts?', a: 'Yes. It rips the audio track cleanly at native sample rate.' }
    ],
    relatedTools: [
      { slug: 'trim-video', name: 'Video Trimmer', shortDesc: 'Trim video clips.' },
      { slug: 'mute-video', name: 'Mute Video Audio', shortDesc: 'Strip audio from video.' },
      { slug: 'video-to-gif', name: 'Video to GIF Converter', shortDesc: 'Convert video to looping GIF.' }
    ]
  },
  'ocr-text-extractor': {
    slug: 'ocr-text-extractor',
    toolName: 'OCR Text Extractor (Image & PDF to Text)',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Upload Image or Document', desc: 'Select a scanned receipt, invoice, book page, or screenshot.' },
      { stepNumber: 2, title: 'Select Language', desc: 'Choose English, Hindi, or bilingual recognition.' },
      { stepNumber: 3, title: 'Run Neural OCR AI', desc: 'Tesseract.js WebAssembly parses printed and handwritten characters.' },
      { stepNumber: 4, title: 'Copy or Download Text', desc: 'Copy extracted text to clipboard or save as a TXT file.' }
    ],
    constraints: [
      { label: 'OCR Engine', value: 'Tesseract.js neural WebAssembly engine' },
      { label: 'Supported Scripts', value: 'Latin (English) and Devanagari (Hindi)' }
    ],
    faqs: [
      { q: 'Can it read text from low-quality screenshots?', a: 'Yes. Higher contrast and clean lighting produce the highest accuracy.' }
    ],
    relatedTools: [
      { slug: 'word-counter', name: 'Word Counter Pro', shortDesc: 'Analyze word count and reading time.' },
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Convert between JSON, YAML, CSV.' },
      { slug: 'qr-generator', name: 'QR Code Generator', shortDesc: 'Generate scannable QR codes.' }
    ]
  },
  'data-format-converter': {
    slug: 'data-format-converter',
    toolName: 'Data Format Converter (JSON ↔ YAML ↔ XML ↔ CSV)',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Paste or Upload Data', desc: 'Input your raw JSON, YAML, XML, or CSV payload.' },
      { stepNumber: 2, title: 'Select Target Format', desc: 'Choose your desired output structure.' },
      { stepNumber: 3, title: 'Validate & Convert', desc: 'Real-time parser formats syntax and detects errors.' },
      { stepNumber: 4, title: 'Copy or Download', desc: 'Copy formatted output or download file.' }
    ],
    constraints: [
      { label: 'Supported Formats', value: 'JSON, YAML 1.2, XML, Tabular CSV' },
      { label: 'Validation', value: 'Real-time schema and syntax error highlighting' }
    ],
    faqs: [
      { q: 'Is my data safe when converting sensitive JSON payloads?', a: 'Yes. Conversion is 100% client-side in your browser. No data is sent to our servers.' }
    ],
    relatedTools: [
      { slug: 'unix-timestamp-converter', name: 'Unix Timestamp Converter', shortDesc: 'Convert epoch timestamps.' },
      { slug: 'word-counter', name: 'Word Counter', shortDesc: 'Analyze text statistics.' },
      { slug: 'qr-generator', name: 'QR Code Generator', shortDesc: 'Create QR codes from text or links.' }
    ]
  },
  'unix-timestamp-converter': {
    slug: 'unix-timestamp-converter',
    toolName: 'Unix Timestamp Converter Pro',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Enter Timestamp or Date', desc: 'Input an epoch number (seconds or milliseconds) or pick a calendar date.' },
      { stepNumber: 2, title: 'View Global Timezones', desc: 'Inspect UTC, Local system time, ISO 8601, and RFC 2822 timestamps.' },
      { stepNumber: 3, title: 'Copy Format', desc: 'One-click copy for backend development and API testing.' }
    ],
    constraints: [
      { label: 'Epoch Units', value: 'Seconds (10 digits) and Milliseconds (13 digits)' },
      { label: 'Timezone Precision', value: 'UTC, Local Timezone, ISO 8601, Relative time (e.g. 2 hours ago)' }
    ],
    faqs: [
      { q: 'What is a Unix timestamp?', a: 'It represents the number of seconds that have elapsed since the Unix epoch (January 1, 1970 00:00:00 UTC).' }
    ],
    relatedTools: [
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Convert JSON, YAML, XML, CSV.' },
      { slug: 'word-counter', name: 'Word Counter', shortDesc: 'Analyze text length and reading time.' },
      { slug: 'sip-calculator', name: 'SIP Wealth Calculator', shortDesc: 'Calculate compound investments.' }
    ]
  },
  'lorem-ipsum-generator': {
    slug: 'lorem-ipsum-generator',
    toolName: 'Lorem Ipsum Dummy Text Generator',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Select Quantity & Unit', desc: 'Choose number of paragraphs, sentences, words, or list items.' },
      { stepNumber: 2, title: 'Set Options', desc: 'Toggle whether to start with classic "Lorem ipsum dolor sit amet...".' },
      { stepNumber: 3, title: 'Copy to Clipboard', desc: 'One-click copy formatted placeholder text for mockups and UI design.' }
    ],
    constraints: [
      { label: 'Output Types', value: 'Paragraphs, Sentences, Words, Bullet Lists, HTML tags' },
      { label: 'Vocabulary', value: 'Classical Latin literature Cicero de Finibus Bonorum' }
    ],
    faqs: [
      { q: 'Why do designers use Lorem Ipsum?', a: 'It provides a natural distribution of letters without readable text distracting viewers from the visual layout.' }
    ],
    relatedTools: [
      { slug: 'word-counter', name: 'Word Counter', shortDesc: 'Count words and analyze character length.' },
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Format JSON and CSV.' },
      { slug: 'qr-generator', name: 'QR Code Generator', shortDesc: 'Generate scannable QR codes.' }
    ]
  },
  'word-counter': {
    slug: 'word-counter',
    toolName: 'Word & Character Counter Pro',
    category: 'dev',
    categoryLabel: 'Dev & Text',
    steps: [
      { stepNumber: 1, title: 'Type or Paste Text', desc: 'Enter your article, essay, or social media post.' },
      { stepNumber: 2, title: 'Live Metric Analysis', desc: 'See real-time words, characters (with & without spaces), sentences, and paragraphs.' },
      { stepNumber: 3, title: 'Inspect Reading Time', desc: 'Review estimated silent reading and speaking duration plus keyword density.' }
    ],
    constraints: [
      { label: 'Metrics Calculated', value: 'Words, Characters, Spaces, Sentences, Paragraphs, Reading Time (225 WPM), Speaking Time' },
      { label: 'Privacy', value: '100% In-Browser. Your writing is never stored or transmitted' }
    ],
    faqs: [
      { q: 'How is reading time calculated?', a: 'Based on the average adult silent reading speed of 225 to 250 words per minute.' }
    ],
    relatedTools: [
      { slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', shortDesc: 'Generate mock layout text.' },
      { slug: 'ocr-text-extractor', name: 'OCR Text Extractor', shortDesc: 'Extract text from images with AI.' },
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Format JSON and CSV data.' }
    ]
  },
  'sip-calculator': {
    slug: 'sip-calculator',
    toolName: 'SIP Wealth & Mutual Fund Calculator',
    category: 'finance',
    categoryLabel: 'Finance & SIP',
    steps: [
      { stepNumber: 1, title: 'Set Monthly Investment', desc: 'Enter the amount you invest every month (e.g. ₹5,000).' },
      { stepNumber: 2, title: 'Set Expected Return Rate', desc: 'Adjust expected annual CAGR return (e.g. 12% for equity mutual funds).' },
      { stepNumber: 3, title: 'Select Time Horizon', desc: 'Slide investment tenure from 1 to 30 years.' },
      { stepNumber: 4, title: 'Inspect Compound Growth', desc: 'View total invested capital, estimated returns, and total future maturity corpus.' }
    ],
    constraints: [
      { label: 'Compounding Formula', value: 'Monthly compounded returns M = P × [((1 + i)^n - 1) / i] × (1 + i)' },
      { label: 'Visualization', value: 'Interactive visual breakdown of Invested vs Wealth Gained' }
    ],
    faqs: [
      { q: 'What is the power of compounding in SIP?', a: 'Over long periods (15+ years), the returns earned on previous returns significantly surpass your invested principal.' }
    ],
    relatedTools: [
      { slug: 'unix-timestamp-converter', name: 'Unix Timestamp Converter', shortDesc: 'Convert epoch timestamps.' },
      { slug: 'data-format-converter', name: 'Data Format Converter', shortDesc: 'Format financial JSON data.' },
      { slug: 'word-counter', name: 'Word Counter', shortDesc: 'Analyze text statistics.' }
    ]
  },
  'festival-greetings': {
    slug: 'festival-greetings',
    toolName: '3D Birthday & Festival Surprise Wisher',
    category: 'fun',
    categoryLabel: 'Wishes & Viral',
    steps: [
      { stepNumber: 1, title: 'Enter Recipient Name', desc: 'Type who this surprise greeting is for.' },
      { stepNumber: 2, title: 'Choose Occasion & Message', desc: 'Select Birthday, Diwali, Eid Mubarak, Christmas, or Holi, and write a heartfelt note.' },
      { stepNumber: 3, title: 'Generate 3D Interactive Surprise', desc: 'Creates an unboxing experience with 3D gift box, celebratory music & confetti.' },
      { stepNumber: 4, title: 'Share Instant Link', desc: 'Share the WhatsApp shortlink with your friends and family.' }
    ],
    constraints: [
      { label: 'Graphics Engine', value: 'Three.js 3D WebGL renderer with particle physics' },
      { label: 'Audio', value: 'Synthesized melodic chimes via Web Audio API' },
      { label: 'Occasions Supported', value: 'Birthday, Diwali, Eid Mubarak, Christmas, Holi' }
    ],
    faqs: [
      { q: 'Does the recipient need to install an app?', a: 'No. The shortlink opens directly in any mobile browser on iPhone and Android.' }
    ],
    relatedTools: [
      { slug: 'qr-generator', name: 'QR Code Generator', shortDesc: 'Create a QR code for your greeting link.' },
      { slug: 'meme-maker', name: 'Meme Maker', shortDesc: 'Make funny celebratory memes.' },
      { slug: 'combine-images-collage', name: 'Combine Images Collage', shortDesc: 'Create a photo collage.' }
    ]
  }
};
