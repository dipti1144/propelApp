export class GlobalvariablesProvider{

    setInitialLoadStatus(value:any) {
        localStorage.setItem('isInitalLoadCompleted',value);
    }
}