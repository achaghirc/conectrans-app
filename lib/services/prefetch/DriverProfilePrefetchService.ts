import { getDriverLicenceByUserId } from "@/lib/data/driver-licence";
import { getExperiencesByUserId } from "@/lib/data/experiences";
import { DriverLicenceProfileDTO } from "@/lib/definitions";
import { QueryClient } from "@tanstack/react-query"

class DriverProfilePreFetchService {
  
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  async prefetchDriverProfileData(userId: string) {
    if(this.queryClient.getQueryData(['driverProfileLicences', userId]) && this.queryClient.getQueryData(['driverProfileExperiences', userId])) {
      return this.queryClient;
    }
    await this.queryClient.prefetchQuery({
      queryKey: ['driverProfileLicences', userId], 
      queryFn: (): Promise<DriverLicenceProfileDTO | undefined> => getDriverLicenceByUserId(userId), 
      staleTime: 1000 * 60 * 60 * 24 // 24 hours
    });
    
    await this.queryClient.prefetchQuery({ 
      queryKey: ['driverProfileExperiences', userId], 
      queryFn: () => getExperiencesByUserId(userId),
      staleTime: 1000 * 60 * 60 * 24 // 24 hours
    });
  }
}

export default DriverProfilePreFetchService;