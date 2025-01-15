/**
 * Fetches tenant data based on the subdomain.
 * @param subdomain - The subdomain of the tenant.
 * @returns The tenant data or null if the tenant is not found.
 */

// Remove the axios import

interface DrivingSchool {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  domain: string | null;
  driving_school_urls: {
    logo_url: string | null;
  };
  // ... other properties
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTenantData(subdomain: string) {
  try {
    const response = await fetch(API_URL + '/driving-school/get?offset=0&limit=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const schools: DrivingSchool[] = await response.json();

    const matchedSchool = schools.find(school => school.website === subdomain);

    if (matchedSchool) {
      return {
        id: matchedSchool.id,
        name: matchedSchool.name,
        domain: matchedSchool.domain || `${matchedSchool.website}.com`,
        logo: matchedSchool.driving_school_urls?.logo_url || '',
        description: matchedSchool.description,
        phone: matchedSchool.phone,
        email: matchedSchool.email,
        address: matchedSchool.address,
        // Add other properties as needed
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching tenant data:', error);
    return null;
  }
}