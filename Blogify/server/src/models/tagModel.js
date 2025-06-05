class TagModel {
  constructor({ name, description, color }) {
    this.name = name;
    this.description = description || "";
    this.color = color || "#6366F1"; // Default indigo color
  }
}

export default TagModel;
