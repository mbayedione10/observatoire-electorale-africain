export interface SearchableItem {
      id: string;
      name: string;
      [key: string]: any;
    }

    export class SearchEngine<T extends SearchableItem> {
      private items: T[];
      private searchKeys: string[];

      constructor(items: T[], searchKeys: string[] = ['name']) {
        this.items = items;
        this.searchKeys = searchKeys;
      }

      // Custom search implementation without external library
      search(query: string): T[] {
        if (!query.trim()) return this.items;

        const normalizedQuery = this.normalizeString(query);

        return this.items.filter(item => 
          this.searchKeys.some(key => {
            const value = item[key];
            if (typeof value === 'string') {
              return this.normalizeString(value).includes(normalizedQuery);
            }
            if (Array.isArray(value)) {
              return value.some(v => 
                this.normalizeString(String(v)).includes(normalizedQuery)
              );
            }
            return false;
          })
        );
      }

      // Normalize string for better search matching
      private normalizeString(str: string): string {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
      }

      filterItems(
        items: T[], 
        filters: {
          regions?: string[];
          types?: string[];
          yearRange?: [number, number];
        }
      ): T[] {
        return items.filter(item => {
          const matchesRegion = !filters.regions?.length || 
            filters.regions.includes(item.region);
          
          const matchesType = !filters.types?.length || 
            filters.types.includes(item.type);
          
          const matchesYear = !filters.yearRange || (
            (!filters.yearRange[0] || item.year >= filters.yearRange[0]) &&
            (!filters.yearRange[1] || item.year <= filters.yearRange[1])
          );

          return matchesRegion && matchesType && matchesYear;
        });
      }

      sortItems(
        items: T[], 
        sortBy: 'alphabetic' | 'date' | 'relevance' = 'alphabetic'
      ): T[] {
        switch (sortBy) {
          case 'alphabetic':
            return [...items].sort((a, b) => a.name.localeCompare(b.name));
          case 'date':
            return [...items].sort((a, b) => 
              (a.year || 0) - (b.year || 0)
            );
          default:
            return items;
        }
      }
    }

    export function saveRecentSearches(key: string, search: string) {
      try {
        const searches = JSON.parse(
          localStorage.getItem(key) || '[]'
        ) as string[];
        
        const updatedSearches = [
          search,
          ...searches.filter(s => s !== search)
        ].slice(0, 5);

        localStorage.setItem(key, JSON.stringify(updatedSearches));
      } catch (error) {
        console.error('Error saving recent searches', error);
      }
    }

    export function getRecentSearches(key: string): string[] {
      try {
        return JSON.parse(
          localStorage.getItem(key) || '[]'
        ) as string[];
      } catch (error) {
        console.error('Error retrieving recent searches', error);
        return [];
      }
    }
