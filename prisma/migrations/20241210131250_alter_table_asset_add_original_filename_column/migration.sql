-- CreateIndex
CREATE INDEX "education_personid_idx" ON "Education"("personId");

-- CreateIndex
CREATE INDEX "experience_personid_idx" ON "Experience"("personId");

-- CreateIndex
CREATE INDEX "person_language_personid_idx" ON "PersonLanguages"("personId");
