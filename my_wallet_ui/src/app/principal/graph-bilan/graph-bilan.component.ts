import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { CommunicationsService } from 'src/app/communs/communications.service';

@Component({
  selector: 'app-graph-bilan',
  templateUrl: './graph-bilan.component.html',
  styleUrls: ['./graph-bilan.component.scss']
})
export class GraphBilanComponent implements OnInit {

  @Input() items: { name: string, value: number }[] = [];

  public pieChartOptions: ChartOptions<'pie'>;
  public pieChartPlugins = [];
  public pieChartLabels: string[];
  public pieChartDatasets: any[];

  constructor(private readonly communicationsService: CommunicationsService) { }


  ngOnInit(): void {

    this.majGraph();

    this.communicationsService.majGraphEtatCompte_sbjct$.subscribe((items) => {
      this.items = items;
      this.majGraph();
    });

  }
  majGraph() {
    console.log("🚀 ~ file: graph-bilan.component.ts:19 ~ GraphBilanComponent ~ items", this.items);
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

    this.pieChartLabels = this.items.map(i => i.name);
    this.pieChartDatasets = [{
      data: this.items.map(i => i.value)//[300, 500, 100]
    }]

    console.log("🚀 ~ pieChartLabels", this.pieChartLabels);
    console.log("🚀 ~ pieChartDatasets", this.pieChartDatasets);
  }
}