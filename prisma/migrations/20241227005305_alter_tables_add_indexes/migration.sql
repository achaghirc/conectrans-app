-- CreateIndex
CREATE INDEX "application_personid_idx" ON "ApplicationOffer"("personId");

-- CreateIndex
CREATE INDEX "application_offerid_idx" ON "ApplicationOffer"("offerId");

-- CreateIndex
CREATE INDEX "application_personid_offerid_idx" ON "ApplicationOffer"("personId", "offerId");

-- CreateIndex
CREATE INDEX "company_userid_idx" ON "Company"("userId");

-- CreateIndex
CREATE INDEX "offer_userid_idx" ON "Offer"("userId");

-- CreateIndex
CREATE INDEX "offer_userid_subscriptionid_idx" ON "Offer"("userId", "subscriptionId");

-- CreateIndex
CREATE INDEX "offer_employment_offerid_idx" ON "OfferEmploymentPreferences"("offerId");

-- CreateIndex
CREATE INDEX "offer_licence_offerid_idx" ON "OfferLicencePreferences"("offerId");

-- CreateIndex
CREATE INDEX "offer_workrange_offerid_idx" ON "OfferWorkRangePreferences"("offerId");

-- CreateIndex
CREATE INDEX "person_userid_idx" ON "Person"("userId");

-- CreateIndex
CREATE INDEX "subscription_userid_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_userid_planid_idx" ON "Subscription"("userId", "planId");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "User"("email");
