define(['jquery', 'shufflejs'] , function ($, Shuffle) {
    if (window.location.pathname !== "/blog") return {init: $.noop};
    var opt, shuffleInstance, $inputs;
    var _activeFilters = [];
    
    function init(user_options) {
        opt = $.extend({
            tousbtn: '#tous-btn',
            form: '.filters-buttons',
            list: '.list-hub',
            mode:'any'}, user_options);
        shuffleInstance = new Shuffle($(opt.list), {
          itemSelector: "li[data-groups]",
          filterMode: opt.mode,
         // sizer: document.querySelector('.list-hub').querySelector('.sizer-element')
        });
        $inputs = $(opt.form).find('input').not(opt.tousbtn);
        $inputs.click(handleFilterClick); // set event
        $(opt.tousbtn).on('change', function() {
            $inputs.filter(":checked").click();
            shuffleInstance.filter(Shuffle.ALL_ITEMS); // or .filter()
        });
        return shuffleInstance;
    }

    function handleFilterClick(evt) {
        var isActive = this.classList.contains('active');
        var btnGroup = this.getAttribute('data-group');
        // If this button is already active, remove it from the list of filters.
        if (isActive) {
            _activeFilters.splice(_activeFilters.indexOf(btnGroup), 1);
        } else { // Or else add it
            _activeFilters.push(btnGroup);
        }
        this.classList.toggle('active');
        shuffleInstance.filter(_activeFilters);
        var nb_checked = $inputs.filter(function() {return $(this).prop('checked');}).length;
        $(opt.tousbtn).prop('checked', !nb_checked || nb_checked == $inputs.length);
    };

    comp = {
        init: init
    };

    return comp;
});

// 'exclusive' mode lets only one filter button be active at a time. In HandleFilterClick

//    if (shuffleInstance.options.filterMode === 'exclusive') {
//        removeActiveClassFromChildren(this.parentNode);
//
//        var filterGroup;
//        if (isActive) {
//            this.classList.remove('active');
//            filterGroup = Shuffle.ALL_ITEMS;
//        } else {
//            this.classList.add('active');
//            filterGroup = btnGroup;
//        }
//
//        shuffleInstance.filter(filterGroup);
//    }
//
//    function removeActiveClassFromChildren(parent) {
//        var children = parent.children;
//        for (var i = children.length - 1; i >= 0; i--) {
//            children[i].classList.remove('active');
//        }
//    };