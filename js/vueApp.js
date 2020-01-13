new Vue({
    el: '#app',
    data: {
        currentTab: 'Templates',
        tabs: ['Templates', 'Editor']
    },
    mounted: function() {
        this.$on('set-tab', function (tab) {
            this.currentTab=tab;
        });
    },
    template:
        '<div>' +
            '<nav class="nav nav-fill nav-pills sticky-top">' +
                    '<span v-for="tab in tabs" v-bind:key="tab" v-on:click="currentTab = tab"' +
                        'v-bind:class="[\'nav-item\', \'nav-link\', { active: currentTab === tab }]">' +
                        '{{tab}}' +
                    '</span> ' +
            '</nav>' +
            '<templates v-show="currentTab===\'Templates\'"></templates>' +
            '<editor v-show="currentTab===\'Editor\'"></editor>' +
        '</div>'
})