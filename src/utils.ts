import { Repository } from "typeorm";
import { Contact } from "./entity/Contact";
import { IdentityResponse } from "./types/IdentifyResponse";

export class ContactUtils {
  private contactRepository: Repository<Contact>;
  constructor(contactRepository: Repository<Contact>) {
    this.contactRepository = contactRepository;
  }

  private removeDuplicates = (arr: any[], elementToRemove?: any) => {
    // Remove duplicates
    const uniqueArr = Array.from(new Set(arr));

    if (elementToRemove) {
      const indexToRemove = uniqueArr.indexOf(elementToRemove);
      if (indexToRemove > -1) {
        uniqueArr.splice(indexToRemove, 1);
      }
    }

    return uniqueArr;
  };

  private getSecondaryContacts = async (
    primaryContactId: number
  ): Promise<Contact[]> => {
    return await this.contactRepository.findBy({
      linkedId: primaryContactId,
    });
  };

  private filterEmailsFromContacts = (contacts: Contact[]): string[] => {
    return contacts.map((contact) => contact.email);
  };

  private filterPhonesFromContacts = (contacts: Contact[]): string[] => {
    return contacts.map((contact) => contact.phoneNumber);
  };

  private filterIdsFromContacts = (contacts: Contact[]): number[] => {
    return contacts.map((contact) => contact.id);
  };

  public getIdentifyResponse = async (
    primaryContact: Contact,
    primaryIdName: string = "id"
  ): Promise<IdentityResponse> => {
    const secondaryContacts = await this.getSecondaryContacts(
      primaryContact[primaryIdName]
    );

    if (primaryIdName === "linkedId") {
      primaryContact = await this.contactRepository.findOneBy({
        id: primaryContact.linkedId,
      });
    }

    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails: [
          primaryContact.email,
          ...this.removeDuplicates(
            this.filterEmailsFromContacts(secondaryContacts),
            primaryContact.email
          ),
        ],
        phoneNumbers: [
          primaryContact.phoneNumber,
          ...this.removeDuplicates(
            this.filterPhonesFromContacts(secondaryContacts),
            primaryContact.phoneNumber
          ),
        ],
        secondaryContactIds: this.removeDuplicates(
          this.filterIdsFromContacts(secondaryContacts)
        ),
      },
    };
  };
}
