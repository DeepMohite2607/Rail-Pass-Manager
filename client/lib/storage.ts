import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { User, ConcessionApplication } from "@/types";

const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
  APPLICATIONS: "applications",
  DRAFT_APPLICATION: "draft_application",
};

async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const AuthStorage = {
  async saveToken(token: string): Promise<void> {
    await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async removeToken(): Promise<void> {
    await deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
    await AsyncStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT_APPLICATION);
  },
};

export const ApplicationStorage = {
  async saveApplications(apps: ConcessionApplication[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  async getApplications(): Promise<ConcessionApplication[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : [];
  },

  async addApplication(app: ConcessionApplication): Promise<void> {
    const apps = await this.getApplications();
    apps.unshift(app);
    await this.saveApplications(apps);
  },

  async updateApplication(
    id: string,
    updates: Partial<ConcessionApplication>
  ): Promise<void> {
    const apps = await this.getApplications();
    const index = apps.findIndex((a) => a.id === id);
    if (index !== -1) {
      apps[index] = { ...apps[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveApplications(apps);
    }
  },

  async getApplicationById(id: string): Promise<ConcessionApplication | null> {
    const apps = await this.getApplications();
    return apps.find((a) => a.id === id) || null;
  },

  async saveDraft(draft: Partial<ConcessionApplication>): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.DRAFT_APPLICATION, JSON.stringify(draft));
  },

  async getDraft(): Promise<Partial<ConcessionApplication> | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT_APPLICATION);
    return data ? JSON.parse(data) : null;
  },

  async clearDraft(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT_APPLICATION);
  },
};
