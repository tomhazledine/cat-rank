MyApp = new Backbone.Marionette.Application();


 
MyApp.addRegions({
    mainRegion: "#content"
});



AngryCat = Backbone.Model.extend({});



AngryCats = Backbone.Collection.extend({
    model: AngryCat
});



AngryCatView = Backbone.Marionette.ItemView.extend({
    template: "#angry_cat-template",
    tagName: 'tr',
    className: 'angry_cat'
});



AngryCatsView = Backbone.Marionette.CompositeView.extend({
    tagName: "table",
    id: "angry_cats",
    className: "table-striped table-bordered",
    template: "#angry_cats-template",
    itemView: AngryCatView,

    // Update: rerender the compositeView's collection when it is sorted (new behavior post update)
    // initialize: function(){
    //     this.listenTo(this.collection, "sort", this.renderCollection);
    // },

    appendHtml: function(collectionView, itemView){
        collectionView.$("tbody").append(itemView.el);
    }
});



MyApp.addInitializer(function(options){
    var angryCatsView = new AngryCatsView({
        collection: options.cats
    });
    MyApp.mainRegion.show(angryCatsView);
});



$(document).ready(function(){
    var cats = new AngryCats([
        { name: 'Wet Cat' },
        { name: 'Bitey Cat' },
        { name: 'Surprised Cat' }
    ]);

    MyApp.start({cats: cats});
});