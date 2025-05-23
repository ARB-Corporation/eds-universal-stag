export default function Category(category, tag, path, position) {
  this.category = category;
  this.tags = [tag];
  this.path = path;
  this.position = position;
  this.count = 1;
}
