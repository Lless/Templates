Vue.component('template-item', {
    props: ['tmplt'],
    template: '<li class="list-group-item">' + 
                    '<span class="badge badge-primary rounded-pill mr-1">' + 
                        '{{tmplt[0]}}' + 
                    '</span>' + 
                    '{{tmplt[1]}}' + 
                    '<button class="btn btn-sm btn-edit btn-light float-right"></button>' + 
            '</li>',
})

new Vue({
    el: '#app',
    data: {
        templates: new Map([
            ["1", "One"],
            ["2","Two"],
            ["2021", "Two thouthands and twenty one1111111111111"]
        ])
    }
})