import { initializeApp } from 'firebase-admin/app';

class alertService {
    init = function() {
        this.app = initializeApp();
    }
}