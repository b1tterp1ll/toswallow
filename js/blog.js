document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

async function loadPosts() {
    try {
        // Load the post index
        const response = await fetch('posts/index.json');
        const posts = await response.json();
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        // Get container
        const postsContainer = document.getElementById('posts-container');
        
        // Clear container
        postsContainer.innerHTML = '';
        
        // Create converter for markdown
        const converter = new showdown.Converter();
        
        // Process each post
        for (const post of posts) {
            try {
                const postResponse = await fetch(`posts/${post.file}`);
                const postContent = await postResponse.text();
                
                // Create post element
                const postElement = document.createElement('div');
                postElement.className = 'post';
                
                // Format date nicely
                const postDate = new Date(post.date);
                const formattedDate = postDate.toISOString().split('T')[0];
                
                // Add title and date
                postElement.innerHTML = `
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-date">${formattedDate}</div>
                    <div class="post-content">${converter.makeHtml(postContent)}</div>
                `;
                
                // Add to container
                postsContainer.appendChild(postElement);
            } catch (error) {
                console.error(`Error loading post ${post.file}:`, error);
            }
        }
        
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-container').innerHTML = 
            '<p>Error loading posts. Please try again later.</p>';
    }
}