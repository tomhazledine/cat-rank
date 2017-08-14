MyApp = new Backbone.Marionette.Application();


 
MyApp.addRegions({
    mainRegion: "#content"
});



AngryCat = Backbone.Model.extend({

    defaults: {
        votes: 0
    },

    addVote: function(){
        this.set('votes', this.get('votes') + 1);
    },

    rankUp: function() {
        // this.addVote();
        this.set({rank: this.get('rank') - 1});
    },

    rankDown: function() {
        // this.addVote();
        this.set({rank: this.get('rank') + 1});
    }
});



AngryCats = Backbone.Collection.extend({
    model: AngryCat,

    initialize: function(cats){
        var rank = 1;
        _.each(cats, function(cat) {
            console.log(cat);
            cat.set('rank', rank);
            ++rank;
        });

        var self = this;

        MyApp.on('rank:up', function(cat){
            cat.addVote();
            if (cat.get('rank') === 1) {
                // can't increase rank of top-ranked cat
                return true;
            }
            self.rankUp(cat);
            self.sort();
            self.trigger('reset');
        });

        MyApp.on('rank:down', function(cat){
            cat.addVote();
            if (cat.get('rank') === self.size()) {
                // can't decrease rank of lowest ranked cat
                return true;
            }
            self.rankDown(cat);
            self.sort();
            self.trigger('reset');
        });

        this.on('add', function(cat){
            if( ! cat.get('rank') ) {
                var error =  Error('Cat must have a rank defined before being added to the collection');
                error.name = 'NoRankError';
                throw error;
            }
        });
    },

    comparator: function(cat) {
        return cat.get('rank');
    },
 
    rankUp: function(cat) {
        // find the cat we're going to swap ranks with
        var rankToSwap = cat.get('rank') - 1;
        var otherCat = this.at(rankToSwap - 1);

        // swap ranks
        cat.rankUp();
        otherCat.rankDown();
    },

    rankDown: function(cat) {
        // find the cat we're going to swap ranks with
        var rankToSwap = cat.get('rank') + 1;
        var otherCat = this.at(rankToSwap - 1);

        // swap ranks
        cat.rankDown();
        otherCat.rankUp();
    }
});



AngryCatView = Backbone.Marionette.ItemView.extend({
    template: "#angry_cat-template",
    tagName: 'tr',
    className: 'angry_cat',

    events: {
        'click .rank_up img': 'rankUp',
        'click .rank_down img': 'rankDown'
    },

    initialize: function(){
        this.bindTo(this.model, 'change:votes', this.render);
        // this.listenTo(this.model, "change:votes", this.render);
    },

    rankUp: function(){
        MyApp.trigger('rank:up', this.model);
    },

    rankDown: function(){
        MyApp.trigger('rank:down', this.model);
    }
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
        new AngryCat({ name: 'Wet Cat', image_path: 'assets/images/cat2.jpg' }),
        new AngryCat({ name: 'Bitey Cat', image_path: 'assets/images/cat1.jpg' }),
        new AngryCat({ name: 'Surprised Cat', image_path: 'assets/images/cat3.jpg' })
    ]);

    MyApp.start({cats: cats});

    cats.add(new AngryCat({
        name: 'Cranky Cat',
        image_path: 'assets/images/cat4.jpg',
        rank: cats.size() + 1
    }));
});