import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  @Input() items: any[] = [];
  @Output() searchResults = new EventEmitter<any[]>();

  searchTerm: string = '';

  onSearchChange() {
    const cleanTerm = this.cleanString(this.searchTerm.toLowerCase());
    console.log('Search Term:', cleanTerm); 
  
    if (!cleanTerm) {
     
      console.log('Emitting full list'); 
      this.searchResults.emit([...this.items]);
    } else {
      
      const filteredItems = this.items.filter((item) =>
        Object.values(item).some(value =>
          this.cleanString(String(value).toLowerCase()).includes(cleanTerm)
        )
        
      );
      console.log('Emitting filtered items:', filteredItems); 
      this.searchResults.emit(filteredItems);
    }
  }
  

  private cleanString(str: string): string {
    // Remove special characters and spaces
    return str.replace(/[^a-zA-Z0-9]/g, '');
  }
}
