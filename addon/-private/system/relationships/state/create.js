import Ember from 'ember';
import ManyRelationship from "ember-data/-private/system/relationships/state/has-many";
import BelongsToRelationship from "ember-data/-private/system/relationships/state/belongs-to";
import EmptyObject from "ember-data/-private/system/empty-object";

var get = Ember.get;

let createRelationshipFor = function(record, relationshipMeta, store) {
  var inverseKey;
  var inverse = record.type.inverseFor(relationshipMeta.key, store);

  if (inverse) {
    inverseKey = inverse.name;
  }

  if (relationshipMeta.kind === 'hasMany') {
    return new ManyRelationship(store, record, inverseKey, relationshipMeta);
  } else {
    return new BelongsToRelationship(store, record, inverseKey, relationshipMeta);
  }
}

createRelationshipFor = typeof window === 'object' && typeof window.perfWrap === 'function' ? window.perfWrap(createRelationshipFor, 'createRelationshipFor') : createRelationshipFor;

export default function Relationships(record) {
  this.record = record;
  this.initializedRelationships = new EmptyObject();
}

Relationships.prototype.has = function(key) {
  return !!this.initializedRelationships[key];
};

Relationships.prototype.get = function(key) {
  var relationships = this.initializedRelationships;
  var relationshipsByName = get(this.record.type, 'relationshipsByName');
  if (!relationships[key] && relationshipsByName.get(key)) {
    relationships[key] = createRelationshipFor(this.record, relationshipsByName.get(key), this.record.store);
  }
  return relationships[key];
};
