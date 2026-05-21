export interface FragmentLookupRequest {
  fragmentId: string;
}

export interface FragmentStoreContract {
  getFragment(request: FragmentLookupRequest): Promise<unknown>;
}
