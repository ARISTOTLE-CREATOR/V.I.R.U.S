export const parseMarkdownTable = (markdown) => {
  const lines = markdown.split('\n');
  const channels = [];
  let currentCategory = 'General';

  lines.forEach(line => {
    // Detect Headers (e.g., ## DVB-T)
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      return;
    }

    // Parse Table Rows
    // Format: | # | Channel | Link | Logo | EPG id |
    if (line.trim().startsWith('|') && !line.includes('---')) {
      // Split by pipe and remove empty first/last elements
      const columns = line.split('|').map(col => col.trim()).filter((col, index, arr) => {
        // Keep only inner columns, ignore the empty strings from leading/trailing pipes
        return index !== 0 && index !== arr.length - 1;
      });

      // We need at least 3 columns: #, Name, Link
      if (columns.length >= 3) {
        const id = columns[0];
        
        // Skip header rows or invalid IDs
        if (isNaN(parseInt(id))) return;

        // Clean Name: Remove YouTube symbol Ⓨ and extra spaces
        const rawName = columns[1] || '';
        const name = rawName.replace(/Ⓨ/g, '').trim();

        // Extract Link: [>](url) -> url
        // Matches anything inside parenthesis
        const linkMatch = columns[2].match(/\((.*?)\)/);
        const url = linkMatch ? linkMatch[1] : '';

        // Extract Logo: <img src="url" /> -> url
        // Fallback to empty string if no logo column
        let logo = '';
        if (columns[3]) {
          const logoMatch = columns[3].match(/src="(.*?)"/);
          logo = logoMatch ? logoMatch[1] : '';
        }

        if (url) {
          channels.push({
            id,
            name,
            url,
            logo,
            category: currentCategory,
            isYoutube: url.includes('youtube.com') || url.includes('youtu.be')
          });
        }
      }
    }
  });

  return channels;
};