class BlogModel {
  constructor({ title, author, imageUrl, excerpt, content, tags }) {
    this.title = title;
    this.author = author;
    this.imageUrl = imageUrl;
    this.excerpt = excerpt;
    this.content = content;
    this.tags = tags;
  }
}

export default BlogModel;
