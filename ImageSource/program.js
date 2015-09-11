var view;
var view2;

function pageDidLoad() {
  var image_source = make_image_source(true);
  view = make_image_source_view(image_source);
  view.init("live", "display", "camera");
  // Demo: two views
  view2 = make_image_source_view(image_source);
  view2.init("live2", "display2", "camera2");
}
