/**
 * pager class to manage pages and pagination for a given listing.
 */
export class PagerController {
  private _list: Array<any>;
  private _total: number;
  private _pages: number;
  private _limit: number;
  private _current = 1;
  private _main: Array<any>;
  private _offset = 0;

  constructor(list: Array<any>, limit: number) {
    this._main = list;
    this._limit = limit;
    this._total = list.length;
  }

  get list(): Array<any> {
    this._offset = this._current * this._limit - this._limit;
    this._list = this._main.filter((item, index) => {
      return index >= this._offset && index < this._offset + this.limit;
    });
    return this._list;
  }

  get total(): number {
    return this._total;
  }

  get pages(): number {
    if (this._pages === undefined) {
      if (this._total > this._limit) {
        const pages = this._total / this._limit;
        if (Math.floor(pages) === pages) {
          this._pages = Math.floor(pages);
        } else {
          this._pages = Math.floor(pages) + 1;
        }
      } else {
        this._pages = 1;
      }
    }
    return this._pages;
  }

  get limit(): number {
    return this._limit;
  }

  get next(): boolean {
    return this._current < this._pages;
  }

  get prev(): boolean {
    return this._current > 1;
  }

  get current(): number {
    return this._current;
  }

  get offset(): number {
    return this._offset;
  }

  nextPage() {
    if (this.next) {
      this._current++;
      this.refresh();
    }
  }

  prevPage() {
    if (this.prev) {
      this._current--;
      this.refresh();
    }
  }

  refresh() {
    return this.list;
  }
}
