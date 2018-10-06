import { Component, OnInit } from '@angular/core';
import { AssetService } from './asset.service';
import { TreeLogicService } from './tree-logic.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public scenarios: any;
  public selectedScenario: any = null;
  constructor(
    private assetService: AssetService,
    private treeLogicService: TreeLogicService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.assetService.getScenariosJSON().subscribe(scenarios => this.scenarios = scenarios);
  }
  public handleScenarioSelect(scenario) {
    if (scenario) {
      let rawScenario = (typeof scenario.data === 'function') ? scenario.data() : scenario.data;
      rawScenario.activePage = rawScenario.pages[0];
      rawScenario.imageUrl = this.getImageUrl(rawScenario.activePage);
      this.selectedScenario = rawScenario;
    } else {
      this.selectedScenario = null;
    }
  }
  public getNextScenarioPage() {
    let pages = this.selectedScenario.pages;
		var activeIndex = pages.indexOf(this.selectedScenario.activePage);
		activeIndex++;
		if (activeIndex === pages.length) {
			activeIndex = 0;
    }
    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.getImageUrl(this.selectedScenario.activePage);
  }
  public handleScenarioUpdate(changedScenario) {
    this.scenarios = this.treeLogicService.updateScenario(this.scenarios, changedScenario);
    this.assetService.setScenariosJSON(this.scenarios);
    this.handleScenarioSelect(this.scenarios.nodes.find(scenario => scenario.data.id === changedScenario.id))
  }
  public handleScenariosImport(scenarios) {
    scenarios.edges = this.scenarios.edges;
    this.scenarios = scenarios;
    this.assetService.setScenariosJSON(this.scenarios);
    this.snackBar.open('Scenarios Imported!', '', {
      duration: 1500,
    });
  }
  private getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
