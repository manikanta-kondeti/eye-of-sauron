'use strict'


var React = require('react');
var Page = require('page');
var Datatable = require('../../components/Datatables');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var Clip = require('../../components/showClip');
var config = require('../../config');



module.exports = React.createClass({

    getInitialState: function() {
        return {voices: null, cursor: ''}
    },

    componentDidMount: function() {

        this.dateRangePicker();
    },

    handleSubmit: function() {

        var legend_val = $('#legend').val();

        var regex = new RegExp(legend_val, 'gi');

        for(var i=0; i < window.chart.series.length; i++) {

            var chart_series = window.chart.series[i]

            if(chart_series.name.match(regex)) {   
                 chart_series.update({ showInLegend: chart_series.options.showInLegend = true}, false)
                 chart_series.setVisible(true, false);
            }
            else {
                chart_series.update({ showInLegend: chart_series.options.showInLegend = false}, false)
                chart_series.setVisible(false, false);

            }
        }    
        window.chart.redraw();

        this.checkAll();
    },

    uncheckAll: function() {
         var series = window.chart.series;
         for(var i=0; i<series.length; i++) {
            if(series[i].checkbox !==undefined) {
                series[i].checkbox.checked = false;
                series[i].setVisible(false, false);
            }
        }   
        return true
    },

    checkAll: function() {
        var series = window.chart.series;
        console.log(window.chart.series)
        for(var i=0; i<series.length; i++) {
            if(series[i].checkbox !==undefined) {
                series[i].checkbox.checked = true;
                series[i].setVisible(true, false);
            }
        }     
    },

    dateRangePicker: function() {

        this.dateRangePickerDraw(moment().subtract(29, 'days'), moment());

        $('#reportrange').daterangepicker({
            ranges: {
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, this.dateRangePickerDraw);
    },

    dateRangePickerDraw: function(start, end) {

        var start_date = start.format('YYYY-MM-DD')
        var end_date = end.format('YYYY-MM-DD')
        $('#date').html(start_date + ' - ' + end_date);
        this.drawHighChart(start_date, end_date)
    },

    sortObject: function(obj) {
        var sorted = {}, key, array = [];

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                array.push(key);
            }
        }

        array.sort();

        for (var key = 0; key < array.length; key++) {
            sorted[array[key]] = obj[array[key]];
        }
        return sorted;
     },

    drawHighChart: function(start_date, end_date) {

        var _this = this;

        $.get(config.ajax_url + '/dashboard_get_counter_entity', 
            {start_date: start_date, end_date: end_date},

            function(response) {

                var counter_entities = response['counts'];
                var x_axis = [], series = [];
                var counts_obj = {};

                for (var i=0; i< counter_entities.length; i++) {
                    
                    var name = counter_entities[i]['name'];
                    var count = counter_entities[i]['count'];
                    var date = counter_entities[i]['date'];


                    if(x_axis.indexOf(date) === -1) {
                        x_axis.push(date)
                    }   

                    if(!(name in counts_obj)) {
                        counts_obj[name] = []
                    }

                    counts_obj[name].push(count);
                }

                counts_obj = _this.sortObject(counts_obj);

                Object.keys(counts_obj).forEach(function (key) { 
                    var obj = {};
                    var value = counts_obj[key];
                    obj['name'] = key;
                    
                    //adding padding 
                    if(x_axis.length != value.length) { 
                            var diff = x_axis.length - value.length;
                            for(var i=0; i< diff; i++) {
                                value.unshift(0);
                            }
                    }

                    obj['data'] = value;
                    series.push(obj);
                });

                //allow highlighting of individual series while muting the others
                function showSeries(e) {
                    if(this.graph !==undefined) {
                        if(e.checked ==  true) {
                            if(this.visible == false) {
                                this.show();
                            }
                        }
                        else{
                            if(this.visible == true) {
                                this.hide();
                            }
                        }
                    }
                }


                function highlightSer(chart) {
                    var series = chart.series, i;
                    console.log(series)
                    for(i=0; i<series.length; i++) {
                        series[i].checkbox.checked = true;
                        series[i].selected = true;
                    }
                }

                var optionsChart1 = {
                     chart: {
                        renderTo:'container',
                        defaultSeriesType:'line',
                        y: 30
                    },
                    title: {
                        text: 'Counter Entity Visualization',
                    },
                    xAxis: {
                        categories: x_axis
                    },
                    yAxis: {
                        title: {
                            text: 'Counts'
                        },
                        min: 0
                    },
                    exporting: {
                        enabled:true   
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: true,
                            showCheckbox: true,
                            events: {
                                checkboxClick:showSeries
                            },
                            marker:{
                                symbol:'circle',
                                radius:0,
                                states:{
                                    hover:{
                                        radius:3
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 30,
                        borderWidth: 0
                    },
                    series: series
                }

                window.chart = new Highcharts.Chart(optionsChart1,highlightSer);
            }
        ,'json')
    },
    
    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'
        }

        return (
            
         <div style={RightSideBarStyle}>
            <div style = {{float: 'right'}}>
                <input id="legend" placeholder="search"/>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
            <div id="reportrange" class="pull-right" style={{background: '#fff', cursor: 'pointer', padding: '5px 10px', border: '1px solid #ccc', width: '30%'}}>
                 <i className="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                 <span id="date"></span> <b className="caret"></b>
            </div> 
            <div id="container"></div>
            <button onClick={this.checkAll}>Check All </button>
            <button onClick={this.uncheckAll}> Uncheck All </button>
         </div>

        )
    }
});
