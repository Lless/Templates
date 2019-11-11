Vue.component('templatecard', {
    props: ['tmplt'],
    template: '<div>{{tmplt[0]}} ==== {{tmplt[1]}}</div>'
})

new Vue({
    el: '#app',
    data: {
        templates: new Map([
            ["1", "One"],
            ["2","Two"],
            ["2021", "Two thouthands and twenty one"]
        ])
    }
})