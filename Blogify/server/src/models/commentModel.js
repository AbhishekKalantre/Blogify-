class CommentModel {
  constructor({ postId, postType, name, email, content }) {
    this.postId = postId;
    this.postType = postType;
    this.name = name;
    this.email = email;
    this.content = content;
  }
}

export default CommentModel;
