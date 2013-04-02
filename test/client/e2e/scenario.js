describe('PhoneCat App', function () {
    'use strict';
    it('should redirect everything to pinco', function () {
        browser().navigateTo('/');
        expect(browser().location().url()).toBe('/pinco');
    });

    describe('Home page', function () {
        beforeEach(function () {
            browser().navigateTo('/');
        });

        it('should have 3 awesome thing', function () {
            expect(repeater('.hero-unit li', 'Awesome things list').count()).toBe(3);
        });
    });
});
