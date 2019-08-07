photo ={
    page: 1,
    offset: 100,
    init: function () {
        var that = this;
        $.getJSON("/about/gallery/gallery.json", function (data) {
            that.render(that.page, data);
        });
    },
    render: function (page, data) {
        var begin = (page - 1) * this.offset;
        var end = page * this.offset;
        if (begin >= data.length) return;
        var html, imageNameWithPattern, imageSize, imageX, imageY, li = "";
        for (var i = begin; i < end && i < data.length; i++) {
           imageSize = data[i].split(' ')[0];
           imageX = imageSize.split('.')[0];
           imageY = imageSize.split('.')[1];
           imageNameWithPattern = data[i].substring(imageSize.length + 1);
            li += '<div class="card" style="width:250px">' +
                    '<div class="image-card" style="height:'+ 250 * imageY / imageX + 'px">' +
                      '<a data-fancybox="gallery" href="/uploads/gallery/' + imageNameWithPattern + '">' +
                        '<img srcset="/uploads/gallery/' + imageNameWithPattern + '" src="/uploads/gallery/' + imageNameWithPattern + '"/>' +
                      '</a>' +
                    '</div>' +
                  '</div>'
        }
        $(".image-grid").append(li);
        this.minigrid();
    },
    minigrid: function() {
        var grid = new Minigrid({
            container: '.image-grid',
            item: '.card',
            gutter: 12
        });
        grid.mount();
        $(window).resize(function() {
           grid.mount();
        });
    }
}
photo.init();