(function($) {

    module("plan1");

    // Test case : Plan1 1
    // PLANS

    test("Plan 1", function()
    {
        stop();

        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            this.readRegistrar("default").then(function() {

                // NOTE: this = registrar

                // original count of plans
                var originalCount = -1;
                this.listPlans().count(function(count) {
                    originalCount = count;
                });

                // create another plan
                var property = "def-" + new Date().getTime();
                var planKey = "abc-" + new Date().getTime();
                this.createPlan({
                    "planKey": planKey,
                    "abc": property
                });
                this.listPlans().count(function(count) {
                    equal(count, originalCount + 1, "Created plan");
                });
                this.readPlan(planKey).then(function() {
                    equal(this.getPlanKey(), planKey, "Plan correct plan key");
                });

                // query test
                this.queryPlans({
                    "abc": property
                }).count(function(count) {
                    equal(1, count, "Query found with matching property");
                });

                // delete the plan
                this.readPlan(planKey).del();

                // count plans
                this.listPlans().count(function(count) {
                    equal(count, originalCount, "Plan successfully deleted");
                });

                // validate the error status for reading non-existing plan
                this.trap(function(error) {
                    ok(error.http && error.http.status && error.http.status == '404', '404 error returned');
                    success();
                }).readPlan(planKey).then(function() {

                });


                this.then(function() {
                    success();
                });

            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
