require File.dirname(__FILE__) + '/../spec_helper'

describe Store do
  
  context 'a valid store' do
    subject { Store.make! }
    specify { subject.email should_not be_nil}
  end
  
end